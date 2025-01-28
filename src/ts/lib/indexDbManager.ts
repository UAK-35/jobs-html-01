/** @format */

import { IDBPDatabase, openDB, deleteDB } from "idb";

export default class IndexDbManager {
  private db: any;
  // private db: IDBPDatabase<unknown>;
  private primaryKeyName = "id";

  /**
   * Creates an object to manage access to browser Index DB API
   * @param {string} dbName - Name of database
   * @param {number} dbVersion - Version of database for migrations - changing structure of data
   */
  constructor(
    private dbName: string,
    private dbVersion: number
  ) {}

  public async createObjectStore(tableNames: string[]) {
    try {
      // console.log("createObjectStore called");
      if (this.dbVersion === 0) {
        await deleteDB(this.dbName);
      } else {
        const that = this;
        this.db = await openDB(this.dbName, this.dbVersion, {
          upgrade(db: IDBPDatabase, oldVersion: number, newVersion: number | null, _transaction: any, _event: IDBVersionChangeEvent) {
            // console.log("upgrade called", { oldVersion, newVersion });
            if (oldVersion < 1) {
              tableNames.forEach((tableName) => db.createObjectStore(tableName, { autoIncrement: true, keyPath: that.primaryKeyName }));
            }
            if (newVersion != null) {
              if (newVersion == 0 || oldVersion > newVersion) {
                tableNames.forEach((tableName) => db.deleteObjectStore(tableName));
              } else {
                for (const tableName of tableNames) {
                  if (db.objectStoreNames.contains(tableName)) {
                    // console.log("indexDB tableName (already exists...)", tableName);
                    continue;
                  }
                  // console.log("indexDB tableName (creating...)", tableName);
                  db.createObjectStore(tableName, { autoIncrement: true, keyPath: that.primaryKeyName });
                }
              }
            }
          },
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // public async deleteObjectStore(tableNames: string[]) {
  //   try {
  //     this.db = await openDB(this.dbName, 1, {
  //       async upgrade(db: IDBPDatabase) {
  //         for (const tableName of tableNames) {
  //           if (db.objectStoreNames.contains(tableName)) {
  //             console.log("tableName", tableName);
  //             await db.clear(tableName);
  //             db.deleteObjectStore(tableName);
  //           }
  //         }
  //       },
  //     });
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  public async getValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    // console.log("Get Data ", JSON.stringify(result));
    return result;
  }

  public async getAllValues(tableName: string) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const result = await store.getAll();
    // console.log("Get All Data", JSON.stringify(result));
    return result;
  }

  // TODO: use generics here for value argument
  public async insertValue(tableName: string, value: object) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.add(value);
    // console.log("Put Data ", JSON.stringify(result));
    return result;
  }

  // TODO: use generics here for value argument
  public async patchValue(tableName: string, value: object) {
    if (!(this.primaryKeyName in value)) throw new Error("primary key must be part of value argument object");
    const tx = this.db.transaction(tableName, "readwrite", { durability: "strict" });
    const store = tx.objectStore(tableName);
    const result = await store.put(value);
    // console.log("Patch Data (in-line) ", JSON.stringify(result));
    return result;
  }

  // TODO: use generics here for value argument
  public async patchValueForPk(tableName: string, value: object, pkValue: string | number) {
    const tx = this.db.transaction(tableName, "readwrite", { durability: "strict" });
    const store = tx.objectStore(tableName);
    const result = await store.put(value, pkValue);
    // console.log("Patch Data (out-of-line) ", JSON.stringify(result));
    return result;
  }

  // TODO: use generics here for value argument
  public async searchAndPatch(tableName: string, value: any, searchKey: string) {
    const allValues: any[] = await this.getAllValues(tableName);
    for (let i = 0; i < allValues.length; i++) {
      const record = allValues[i];
      // console.log("TEST", i + 1, searchKey, record[searchKey], value[searchKey], record[searchKey] === value[searchKey]);
      // console.log('record', record);
      // console.log('value', value);
      if (record[searchKey] === value[searchKey]) {
        await this.patchValue("selections", { ...value, [this.primaryKeyName]: record[this.primaryKeyName] });
        return true;
      }
    }
    return false;
  }

  public async searchAndDelete(tableName: string, searchKey: string, searchValue: string | number) {
    const allValues: any[] = await this.getAllValues(tableName);
    for (let i = 0; i < allValues.length; i++) {
      const record = allValues[i];
      if (record[searchKey] === searchValue) {
        await this.deleteValue("selections", record[this.primaryKeyName]);
        return true;
      }
    }
    return false;
  }

  public async putBulkValue(tableName: string, values: object[]) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    for (const value of values) {
      const result = await store.put(value);
      // console.log("Put Bulk Data ", JSON.stringify(result));
    }
    return this.getAllValues(tableName);
  }

  public async deleteValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(id);
    if (!result) {
      console.log("Id not found", id);
      return result;
    }
    await store.delete(id);
    // console.log("Deleted Data", id);
    return id;
  }

  async clearObjectStore(tableName: string) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    await store.clear();
  }
}
