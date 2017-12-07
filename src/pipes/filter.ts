import { Pipe, PipeTransform, Injectable } from '@angular/core';
import * as _ from 'lodash';

/**
 * Generated class for the Filter pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'filter',
})
export class Filter implements PipeTransform {
 transform(value: any, args: string[]): any {
   console.log(value +"/"+ args[0]);
  let filter = args[0];

    if (filter && Array.isArray(value)) {
      let filterKeys = Object.keys(filter);
      return value.filter(item =>
      filterKeys.reduce((memo, keyName) =>
      memo && item[keyName] === filter[keyName], true));
    } else {
      return value;
    }
  }
}

@Pipe({ name: 'order-by' })
export class OrderByPipe  {
  transform(array, args) {
    return _.sortBy(array, args);
  }
}