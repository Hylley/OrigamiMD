// SQL layout is like: id, path, name, authors, pages, progress, seed
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

if(!fs.existsSync('./archives'))
{
	fs.mkdirSync('archives');
}

const path_to_file = path.join('./data.db');
function get_db()
{
	return new sqlite3.Database(path_to_file, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
}

get_db().run(`
	CREATE TABLE IF NOT EXISTS bookshelf (
		book_id  TEXT NOT NULL PRIMARY KEY,
		path     TEXT NOT NULL,
		title    TEXT NOT NULL,
		author   TEXT NOT NULL,
		pages    INT  NOT NULL,
		progress INT  NOT NULL,
		seed     TEXT NOT NULL
	);
`).close();

module.exports = { get_db };