'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

let sqlUp = `
    CREATE TABLE public.users(
      id          SERIAL PRIMARY KEY,
      first_name  varchar(255) NOT NULL,
      last_name   varchar(255) NOT NULL,
      email       varchar(255) NOT NULL UNIQUE,
      password    varchar(255) NOT NULL
    );
    
    CREATE TABLE public.user_chats(
      id               SERIAL PRIMARY KEY,
      user_id          integer NOT NULL,
      interlocutor_id  integer NOT NULL,
      room             uuid NOT NULL
    );
    
    CREATE TABLE public.messages(
      id           SERIAL PRIMARY KEY,
      msg_from_id  integer NOT NULL,
      msg_to_id    integer NOT NULL,
      room         uuid NOT NULL,
      date         timestamp NOT NULL DEFAULT (NOW()),
      message      text DEFAULT NULL,
      file_path    varchar(255) DEFAULT NULL
    );
          
    ALTER TABLE public.user_chats ADD FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE;
    ALTER TABLE public.user_chats ADD FOREIGN KEY (interlocutor_id) REFERENCES public.users (id) ON DELETE CASCADE;
    ALTER TABLE public.messages ADD FOREIGN KEY (msg_from_id) REFERENCES public.users (id) ON DELETE CASCADE;
    ALTER TABLE public.messages ADD FOREIGN KEY (msg_to_id) REFERENCES public.users (id) ON DELETE CASCADE;
`;

let sqlDown = `
    DROP TABLE IF EXISTS public.messages;
    DROP TABLE IF EXISTS public.user_chats;
    DROP TABLE IF EXISTS public.users;
`;

exports.up = function(db, callback) {
  db.runSql(sqlUp, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports.down = function(db, callback) {
  db.runSql(sqlDown, function (err) {
    if (err) return callback(err);
    callback();
  });
};

exports._meta = {
  "version": 1
};
