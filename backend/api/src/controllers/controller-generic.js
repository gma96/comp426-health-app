// @flow
'use strict';
/**
 * creates Generic Controller
 */
class Controller {
  /**
   * Creates Base Controller
   * @param  {string}     _name:string           Name of Resource
   * @param  {string]}    _tableName:string      Name of SQL Table
   * @param  {Array}      _fields:?Array<string> Resource Fields
   * @return {Controller} Controller             Generic Controller
   */
  constructor(_name:string, _tableName:string, _fields:?Array<string>) {
    this._name = _name;
    this._tableName = _tableName;
    this._fields = _fields || [];
    return this;
  }
  /**
   * Get Resource Name
   * @return {string} Resource Name
   */
  get name():string {
    return this._name;
  }

  /**
   * Get Resource Table Name
   * @return {string} Resource Table Name
   */
  get tableName():string {
    return this._tableName;
  }
  
  /**
   * Get Resource Fields
   * @return {Array} Resource Fields
   */
  get fields():?Array<string> {
    return this._fields;
  }
}
