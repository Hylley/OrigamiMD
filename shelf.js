const fs = require("fs");
const unzipper = require('unzipper');
const database = require('./database.js');

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
				console.error(err);
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

	search_for(path)
	{
		return new Promise((resolve, reject) => 
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
				entry.on('end', () => resolve(Buffer.concat(file_buffer)));
				entry.on('error', (err) => reject(err));
			})
			.on('error', (err) => {
				reject(err);
			});;
		});
	}

	async header()
	{
		const atlas = JSON.parse(await this.search_for('atlas.json'));
		const cover_buffer = await this.search_for(`res/${atlas.cover}`);
		return { title: atlas.title, subtitle: atlas.subtitle, authors: atlas.authors, cover_buffer: cover_buffer };
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

/*
	Output exammple:
[
	{
		title: 'Sample',
		subtitle: 'a guide for life',
		cover_buffer: <Buffer 89 50 4e 47 0d 0a ... more bytes>,
		progress: 0
	},
	...
]
*/
async function get_shelf()
{
	return new Promise((resolve, reject) => 
	{
		const db = database.get_db();
		db.all(`
			SELECT * FROM bookshelf
		`, async (err, table) => {
			if(err) reject(err);
			
			const data = [];
			for(i in table)
			{
				const book = get_book(table[i].path);
				data[i] = await book.header();
				data[i]['progress'] = table[i].progress;
				data[i]['id'] = table[i].book_id;
				data[i]['seed'] = table[i].seed;
			}

			resolve(data);
		});
		db.close();
	})
}

module.exports = { get_book, get_shelf };