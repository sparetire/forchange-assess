const co = require('co');
const Http = require('forchange-http');
/* eslint camelcase:0 */

const BOOK_HOST = process.env.BOOK_HOST;


/**
 * api list
 */

const examList = {
	host: BOOK_HOST,
	pathname: '/api/v1/book'
};


class BookModel {
	static getExamList(page, per_page) {
		return co(function* () {
			if (!BOOK_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			page = page || 1;
			per_page = per_page || 10;
			let qs = {
				page,
				per_page
			};
			let data = yield Http.get(examList, qs).catch(err => {
				return Http.get(examList, qs);
			});
			// 这里应该用 error code 判断，但暂时接口文档没有
			if (!data.data) {
				throw new Error(`An error occured when request ${examList.pathname}`);
			}
			return {
				exams: data.data,
				total: data.meta.pagination.total,
				count: data.meta.pagination.count,
				per_page: data.meta.pagination.per_page,
				current_page: data.meta.pagination.current_page,
				total_pages: data.meta.pagination.total_pages
			};
		});
	}
	
}

module.exports = BookModel;