import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
  transform(data: [ string, any ][] | null) {
    return data ? data.filter(v => Number.isInteger(parseInt(v[0]))) : [];
  }
}