const fs = require("fs");
const unzipper = require('unzipper');
const database = require('./database.js')

class Book
{
	constructor(path)
	{
		this.path = path;
	}

	file_info()
	{
		let info = {
			size : 0
		};
		
		fs.stat(path, (err, stats) => {
			if(err)
			{
				console.log(err);
				return;
			}
			
			info.size = stats.size;
		})
		
		return info;
	}

	get_data()
	{
		return fs.readFileSync(this.path);
	}

	header() { return {}; } // Header -> Return display info: cover (buffer), cover image extension, title and subtitle;
	progress() { return 0; }
}

class ORI extends Book
{
	constructor(path)
	{
		super(path);
	}

	search_for(path, callback)
	{
		const file_data = super.get_data();
		const file_stream = require('stream').Readable.from(file_data);
		const file_buffer = [];
		
		file_stream.pipe(unzipper.Parse()).on('entry', (entry) => {
			const file_name = entry.path;
			const file_type = entry.type;

			if (file_type !== 'File' || file_name !== path)
			{
				entry.autodrain();
				return;
			}

			entry.on('data', (chunk) => file_buffer.push(chunk));
			entry.on('end', () => callback(Buffer.concat(file_buffer)));
		});
	}

	header(callback)
	{
		this.search_for('atlas.json', (result) => {
			const atlas = JSON.parse(result);
			this.search_for(`res/${atlas.cover}`, (result) => callback({ title: atlas.title, subtitle: atlas.subtitle, cover_buffer: result }));
		});
	}
}

function getExtension(filename)
{
	let a = filename.split(".");
	if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
		return "c";
	}

	return a.pop();
}

function get_book(path)
{
	switch(getExtension(path))
	{
		case 'epub':

			break;
		case 'pdf':

			break;
		case 'ori':
			return new ORI(path);
			break;
		case 'txt':
			
			break;
		default: break;
	}
}

function get_shelf(callback)
{
	const db = database.get_db();

	db.all(`
		SELECT * FROM bookshelf
	`, (err, table) => {
		callback(table);
	});

	db.close();
}

module.exports = { get_book, get_shelf };