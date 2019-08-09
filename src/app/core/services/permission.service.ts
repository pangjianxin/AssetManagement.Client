import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestActionModel } from 'src/app/models/request-action-model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PermissionNode } from 'src/app/models/permission-node';
import { OrganizationRole } from 'src/app/models/organization-role';
import { ModifyPermission } from 'src/app/models/viewmodels/modify-permission';
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private http: HttpClient) {

  }
  getPermissions(url: string): Observable<PermissionNode[]> {
    return this.http.get<RequestActionModel>(url).pipe(map(it => this.buildFileTree(it.data, 0)));
  }
  getRoles(orgRole: number): Observable<OrganizationRole[]> {
    return this.http.get<RequestActionModel>(`/api/permission/roles?role=${orgRole}`).pipe(map((it) => {
      console.log(it);
      return it.data as OrganizationRole[];
    }));
  }
  modifyPermissions(roleId: string, modifyPermissions: ModifyPermission[]): Observable<RequestActionModel> {
    return this.http.put<RequestActionModel>(`/api/permission/modifypermissions`,
      JSON.stringify({ roleId: roleId, permissions: modifyPermissions }));
  }
  /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `FileNode`.
     */
  private buildFileTree(obj: { [key: string]: any }, level: number): PermissionNode[] {
    return Object.keys(obj).reduce<PermissionNode[]>((accumulator, key) => {
      const array = obj[key];
      const node = {} as PermissionNode;
      node.item = key;
      if (array !== null) {
        if (typeof array === 'object') {
          node.children = this.buildFileTree(array, level + 1);
        } else {
          node.item = array;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}
