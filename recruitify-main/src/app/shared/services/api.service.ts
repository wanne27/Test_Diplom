import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const GET = 'Get';
export const POST = 'Post';
export const CREATE = 'Create';
export const DELETE = 'Delete';
export const UPDATE = 'Update';

export const ODATA = '/odata';
export const API = '/api';
export const TOKEN = '/connect/token';
export const MOCK = '/assets';

const EMPTY_STRING = '';
export interface QueryParams {
  path?: string;
  odata?: OData;
  body?: any;
  login?: boolean;
  mock?: string;
}

export interface OData {
  top?: number;
  skip?: number;
  count?: boolean;
  orderby?: OrderBy;
  filter?: Filter[];
  projectId?: string;
}
interface OrderBy {
  names?: string[];
}

interface Filter {
  property?: string;
  value?: string;
  operator?: string;
}

export abstract class ApiService {
  private readonly serviceName: string;
  private readonly apiPath: string;

  protected constructor(
    private http: HttpClient,
    apiPath: string,
    serviceName: string = ApiService.name
  ) {
    this.apiPath = apiPath;
    this.serviceName = serviceName;
  }

  get<T>(params: QueryParams): Observable<T> {
    return this.wrapRequest<T>(
      this.http.get<T>(this.getApiUrl(params) + this.getQueryOptions(params)),
      GET
    );
  }

  post<T, B>(
    params: QueryParams,
    body: B,
    options: { headers: { [header: string]: string } } = {} as any
  ): Observable<T> {
    return this.wrapRequest<T>(
      this.http.post<T>(
        this.getApiUrl(params) + this.getQueryOptions(params),
        body,
        options
      ),
      CREATE
    );
  }

  put<T, B>(params: QueryParams, body: B): Observable<T> {
    return this.wrapRequest<T>(
      this.http.put<T>(
        this.getApiUrl(params) + this.getQueryOptions(params),
        body
      ),
      UPDATE
    );
  }

  delete<T>(params: QueryParams): Observable<T> {
    return this.wrapRequest<T>(
      this.http.delete<T>(
        this.getApiUrl(params) + this.getQueryOptions(params)
      ),
      DELETE
    );
  }

  protected getApiUrl(params: QueryParams): string {
    if (params.mock) {
      return environment.mockApiUrl + MOCK;
    } else if (params.odata) {
      return params.odata.projectId
        ? environment.apiUrl + ODATA + this.apiPath + '/GetByProject'
        : environment.apiUrl + ODATA + this.apiPath;
    } else if (params.login) {
      return environment.apiUrl + TOKEN + this.apiPath.toLowerCase();
    } else {
      return environment.apiUrl + API + this.apiPath.toLowerCase();
    }
  }

  private getQueryOptions(params: QueryParams): string {
    let url = EMPTY_STRING;
    if (params.mock) {
      url += params.mock;
    } else if (params.odata) {
      url += this.buildOData(params.odata);
    } else if (params.login) {
    } else {
      url += params.path;
    }
    return url;
  }

  private buildOData(odata: OData) {
    const { top, skip, orderby, filter, projectId } = odata;
    let url = '?$count=true';

    url += this.buildODataPath(top, 'top');
    url += this.buildODataPath(skip, 'skip');
    url += this.buildODataCandidatesPath(projectId, 'projectId');

    url += this.buildODataPath(
      orderby && orderby.names
        ? orderby.names.join(',')
        : undefined,
      'orderby'
    );

    url += this.buildODataPath(this.buildFilterParams(filter), 'filter');

    return url;
  }

  private buildFilterParams(filter: Filter[] | undefined) {
    const filterParams = filter
      ?.filter((v) => !!v)
      .map((el) => {
        return Array.isArray(el) && el.length > 0
          ? `(${el.map((item) => `${item.value}`).join(' or ')})`
          : el.property && el.property !== EMPTY_STRING
          ? el.value
          : undefined;
      });
  
    return filterParams?.filter((el) => !!el).join(' and ');
  }

  private buildODataPath(
    parameter: number | string | undefined,
    path: string
  ): string {
    return parameter ? this.buildODataQuery(path, parameter) : EMPTY_STRING;
  }

  private buildODataCandidatesPath(
    parameter: string | undefined,
    path: string
  ): string {
    return parameter ? `&${path}=${parameter}` : EMPTY_STRING;
  }

  private buildODataQuery(query: string, value: number | string): string {
    return (query && value && `&$${query}=${value}`) || EMPTY_STRING;
  }

  private wrapRequest<T>(
    observable: Observable<T>,
    info: string = 'ApiService logger'
  ): Observable<T> {
    return observable.pipe(
      tap(
        (result) => {
          this.log(result, info);
        },
        (error) => {
          this.log(error, info);
        }
      )
    );
  }

  private log(message: any, method: string) {
    if (!environment.production) {
      console.group(method + ' [' + this.serviceName + ']:');
      console.info(message);
      console.groupEnd();
    }
  }
}
