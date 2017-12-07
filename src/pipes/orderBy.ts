import { Pipe, PipeTransform , Injectable} from "@angular/core";
import * as _ from 'lodash';

@Pipe( {
name: 'orderBy'
} )
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, args?: any , ascending:Boolean = true): any {
        console.log(ascending);
        if(ascending){
        return _.sortBy(array, [args]).reverse();
    }
    else{
        return _.sortBy(array, [args]);
    }
    }

}