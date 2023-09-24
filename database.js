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

function init()
{
	const db = get_db();

	db.run(`
		CREATE TABLE IF NOT EXISTS bookshelf (
			book_id      INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			path         TEXT    NOT NULL UNIQUE,
			seed         TEXT,
			scroll_path  TEXT    NOT NULL,
			scroll_value INTEGER NOT NULL,
			progress     INTEGER NOT NULL
		);
	`);

	db.run(`
		CREATE TABLE IF NOT EXISTS preferences (
			key   TEXT NOT NULL,
			value TEXT NOT NULL
		);
	`);

	db.close();
}
init();

module.exports = { get_db };