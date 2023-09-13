// const fs = require("fs");

// class Book
// {
// 	constructor(path)
// 	{
// 		this.path = path;
// 	}

// 	file_info()
// 	{
// 		let info = {
// 			size : 0
// 		};
		
// 		fs.stat(path, (err, stats) => {
// 			if(err)
// 			{
// 				console.log(err);
// 				return;
// 			}
			
// 			info.size = stats.size;
// 		})
		
// 		return info;
// 	}

// 	page_count() { return 1; }
// 	header() { return {}; }
// 	structure() { return {}; }
// }

// function get_book(path, extension)
// {
// 	return Book(path);

// 	switch(extension)
// 	{
// 		case 'epub':

// 			break;
// 		case 'pdf':

// 			break;
// 		case 'ori':

// 			break;
// 		case 'txt':
			
// 			break;
// 		default: break;
// 	}
// }

// module.exports = { get_book };