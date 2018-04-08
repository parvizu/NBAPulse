import { Mongo } from 'meteor/mongo';

export const League = new Mongo.Collection('league');
export const Games = new Mongo.Collection('games');
export const Schedule = new Mongo.Collection('schedule');
export const Teams = new Mongo.Collection('teams');
