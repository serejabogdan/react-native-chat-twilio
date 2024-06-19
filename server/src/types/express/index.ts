// outsource dependencies
import { Request, Response } from 'express';
import { Query } from 'express-serve-static-core';

// types

export interface IReq<B = void> extends Request {
  body: B;
}

export interface IReqQuery<Q extends Query, B = void> extends IReq<B> {
  query: Q;
}

export interface IRes extends Response {
  locals: Record<string, unknown>;
}
