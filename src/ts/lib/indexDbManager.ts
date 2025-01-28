/** @format */

import { deleteDB, IDBPDatabase, openDB } from "idb";

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
      if (this.dbVersion === 0) {
        await deleteDB(this.dbName);
      } else {
        const that = this;
        this.db = await openDB(this.dbName, this.dbVersion, {
          upgrade(db: IDBPDatabase, oldVersion: number, newVersion: number | null, _transaction: any, _event: IDBVersionChangeEvent) {
            if (oldVersion < 1) {
              tableNames.forEach((tableName) => db.createObjectStore(tableName, { autoIncrement: true, keyPath: that.primaryKeyName }));
            }
            if (newVersion != null) {
              if (newVersion == 0 || oldVersion > newVersion) {
                tableNames.forEach((tableName) => db.deleteObjectStore(tableName));
              } else {
                for (const tableName of tableNames) {
                  if (db.objectStoreNames.contains(tableName)) {
                    continue;
                  }
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

  public async getValue(tableName: string, id: number) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    return await store.get(id);
  }

  public async getAllValues(tableName: string) {
    const tx = this.db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    return await store.getAll();
  }

  // TODO: use generics here for value argument
  public async insertValue(tableName: string, value: object) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    return await store.add(value);
  }

  // TODO: use generics here for value argument
  public async patchValue(tableName: string, value: object) {
    if (!(this.primaryKeyName in value)) throw new Error("primary key must be part of value argument object");
    const tx = this.db.transaction(tableName, "readwrite", { durability: "strict" });
    const store = tx.objectStore(tableName);
    return await store.put(value);
  }

  // TODO: use generics here for value argument
  public async patchValueForPk(tableName: string, value: object, pkValue: string | number) {
    const tx = this.db.transaction(tableName, "readwrite", { durability: "strict" });
    const store = tx.objectStore(tableName);
    return await store.put(value, pkValue);
  }

  // TODO: use generics here for value argument
  public async searchAndPatch(tableName: string, value: any, searchKey: string) {
    const allValues: any[] = await this.getAllValues(tableName);
    for (let i = 0; i < allValues.length; i++) {
      const record = allValues[i];
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
      await store.put(value);
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
    return id;
  }

  async clearObjectStore(tableName: string) {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    await store.clear();
  }
}
