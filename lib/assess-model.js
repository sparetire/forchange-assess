const co = require('co');
const Http = require('forchange-http');
/* eslint camelcase:0 */

const ASSESS_HOST = process.env.ASSESS_HOST;

/**
 * Status code
 */
const OK = 200;

/**
 * api list
 */
const questionList = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions',
	restful: true
};
const question = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions/{id}',
	restful: true
};
const addQuestion = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions',
	method: 'post',
	restful: true
};
const updateQuestion = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions/{id}',
	method: 'put',
	restful: true
};
const deleteQuestion = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions/{id}',
	method: 'delete',
	restful: true
};
const examScore = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/scores',
	method: 'post'
};
const switchStatus = {
	host: ASSESS_HOST,
	pathname: '/api/v1/books/{book_id}/questions/{id}/status',
	method: 'put',
	restful: true
};

class AssessModel {
	static getQuestionList(book_id, page, per_page) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			page = page || 1;
			per_page = per_page || 10;
			let urlParam = {
				book_id
			};
			let qs = {
				page,
				per_page
			};
			let data = yield Http.get(questionList, urlParam, qs).catch(err => {
				return Http.get(questionList, urlParam, qs);
			});
			if (!data.data) {
				throw new Error(`An error occured when request ${questionList.pathname}`);
			}
			return {
				questions: data.data,
				total: data.meta.pagination.total,
				count: data.meta.pagination.count,
				per_page: data.meta.pagination.per_page,
				current_page: data.meta.pagination.current_page,
				total_pages: data.meta.pagination.total_pages
			};
		});
	}

	static getQuestion(id, book_id) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			let urlParam = {
				id,
				book_id
			};
			let data = yield Http.get(question, urlParam).catch(err => {
				return Http.get(question, urlParam);
			});
			if (!data.data) {
				throw new Error(`An error occured when request ${question.pathname}`);
			}
			return data.data;
		});
	}
	
	static switchQuestionStatus(id, book_id, question_status) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			let urlParam = {
				id,
				book_id
			};
			let body = {
				question_status
			};
			let data = yield Http.put(switchStatus, body, urlParam).catch(err => {
				return Http.put(switchStatus, body, urlParam);
			});

			// 这里应该要记录下错误，只是接口文档中没给出错误信息的响应格式
			if (data.status_code === OK) {
				return true;
			} else {
				throw new Error(`An error occured when request ${switchStatus.pathname}: ${data.message}`);
			}
		});
	}

	static deleteQuestion(id, book_id) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			let urlParam = {
				id,
				book_id
			};
			let data = yield Http.delete(deleteQuestion, urlParam).catch(err => {
				return Http.deleteQuestion(deleteQuestion, urlParam);
			});
			if (data.status_code === OK) {
				return true;
			} else {
				throw new Error(`An error occured when request ${deleteQuestion.pathname}: ${data.message}`);
			}
		});
	}
	
	static updateQuestion(id, book_id, question) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			let urlParam = {
				id,
				book_id
			};
			let body = question;
			let data = yield Http.put(updateQuestion, body, urlParam).catch(err => {
				return Http.put(updateQuestion, body, urlParam);
			});

			if (data.status_code == OK) {
				return true;
			} else {
				throw new Error(`An error occured when request ${updateQuestion.pathname}: ${data.message}`);
			}
		});
	}
	
	static addQuestion(book_id, question) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			let urlParam = {
				book_id
			};
			let body = question;
			let data = yield Http.post(addQuestion, body, urlParam).catch(err => {
				return Http.post(addQuestion, body, urlParam);
			});
			
			if (data.status_code == OK) {
				return true;
			} else {
				throw new Error(`An error occured when request ${addQuestion.pathname}: ${data.message}`);
			}
		});
	}

	static getExamScore(book_ids) {
		return co(function* () {
			if (!ASSESS_HOST) {
				throw new Error('You must set an ASSESS_HOST first.');
			}
			if (!Array.isArray(book_ids)) {
				throw new Error('book_ids must be an instance of Array.');
			}
			let body = {
				book_ids
			};
			let data = yield Http.post(examScore, body).catch(err => {
				return Http.post(examScore, body);
			});
			if (!data.data) {
				throw new Error(`An error occured when request ${examScore.pathname}`);
			}
			let list = data.data;
			let result = [];
			for (let key in list) {
				let temp = {};
				temp.id = parseInt(key, 10);
				temp.score = list[key];
				result.push(temp);
			}
			return result;
		});
	}
	
}

module.exports = AssessModel;