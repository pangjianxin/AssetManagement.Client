import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationRole } from 'src/app/models/dtos/organization-role';
import { PermissionFlatNode, PermissionNode } from 'src/app/models/dtos/permission-node';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PermissionService } from 'src/app/core/services/permission.service';
import { AccountService } from 'src/app/core/services/account.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ModifyPermission } from 'src/app/models/viewmodels/modify-permission';
import { RequestActionModel } from 'src/app/models/dtos/request-action-model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  roles$: Observable<OrganizationRole[]>;
  currentRole: OrganizationRole;
  /** A selected parent node to be inserted */
  selectedParent: PermissionFlatNode | null = null;
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<PermissionFlatNode, PermissionNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<PermissionNode, PermissionFlatNode>();

  treeControl: FlatTreeControl<PermissionFlatNode>;

  treeFlattener: MatTreeFlattener<PermissionNode, PermissionFlatNode>;

  dataSource: MatTreeFlatDataSource<PermissionNode, PermissionFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<PermissionFlatNode>(true /* multiple */);

  constructor(private permissionService: PermissionService,
    private accountService: AccountService,
    private alert: AlertService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<PermissionFlatNode>(this.getLevel, this.isExpandable);
    this.permissionService.getPermissions(`/api/permission/all`).subscribe(data => {
      if (data) {
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = data;
      }
    });
  }
  ngOnInit() {
    this.roles$ = this.permissionService.getRoles(this.accountService.getCurrentOrg().orgRole);
  }
  getLevel = (node: PermissionFlatNode) => node.level;

  isExpandable = (node: PermissionFlatNode) => node.expandable;

  getChildren = (node: PermissionNode): PermissionNode[] => node.children;

  hasChild = (_: number, _nodeData: PermissionFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: PermissionFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: PermissionNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : {} as PermissionFlatNode;
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: PermissionFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: PermissionFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: PermissionFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: PermissionFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: PermissionFlatNode): void {
    let parent: PermissionFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: PermissionFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: PermissionFlatNode): PermissionFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  submitModifyPermissions() {
    if (!this.currentRole) {
      this.alert.warn('请选择一个角色进行操作');
      return;
    }
    if (this.checklistSelection.selected.filter(it => it.level === 1).length === 0) {
      this.alert.warn('请选择至少一项权限进行操作');
      return;
    }
    const modifyPermissions: ModifyPermission[] = this.checklistSelection.selected.filter(it => it.level === 1).map(it => {
      return { controller: this.getParentNode(it).item, action: it.item };
    });
    const roleId = this.currentRole.id;
    this.permissionService.modifyPermissions(roleId, modifyPermissions).subscribe({
      next: (value: RequestActionModel) => this.alert.success(value.message),
      error: (value: HttpErrorResponse) => this.alert.warn(value.error.message)
    });
  }

}
