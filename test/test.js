const faker = require('faker');
const { SITE_MOUNT } = require('../config/config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const server = require('../dist/index').default;

chai.use(chaiHttp);


const { expect } = chai;

const MOUNT = SITE_MOUNT;

const email = faker.internet.email();
const password = faker.internet.password(6);
const confirm = password;
const title = faker.fake('Book');
const author = faker.internet.userName('Vitaliy','Hryhoriv');
const isfinished = faker.random.boolean();
const notes = faker.lorem.lines();
let agent;
let id;
let token;
let bookid;


describe('autorization', () => {
  before((done) => {
    agent = chai.request.agent(server);
    server.on('AppStarted', () => {
      done();
    });
  });

  it('should register new user', (done) => {
    agent
      .post(`${MOUNT}/auth/register`)
      .send({
        email,
        password,
        confirm,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('user');
        expect(res.body.user).to.haveOwnProperty('_id');
        expect(res.body.user).to.haveOwnProperty('email');
        expect(res.body.user).to.haveOwnProperty('password');
        id = res.body.user._id
        done();
      });
  });

  it('should return logined user', (done) => {
    agent
      .post(`${MOUNT}/auth/login`)
      .send({
        email,
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('user');
        expect(res.body.user).to.haveOwnProperty('_id');
        expect(res.body.user).to.haveOwnProperty('email');
        expect(res.body.user).to.haveOwnProperty('password');
        done();
      });
  });

  it('should make reset token', (done) => {
    agent
      .post(`${MOUNT}/auth/change/${id}`)
      .send({ password })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('user');
        expect(res.body.user).to.haveOwnProperty('_id');
        expect(res.body.user).to.haveOwnProperty('email');
        expect(res.body.user).to.haveOwnProperty('password');
        expect(res.body.user).to.haveOwnProperty('resetToken');
        expect(res.body.user).to.haveOwnProperty('dateToken');
        token = res.body.user.resetToken;
        done();
      });
  });

  it('should get a reset page', (done) => {
    agent
      .get(`${MOUNT}/auth/change/${token}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('data');
        done();
      });
  });

  it('should change password', (done) => {
    agent
      .put(`${MOUNT}/auth/password`)
      .send({
        token,
        password,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('user');
        expect(res.body.user).to.haveOwnProperty('_id');
        expect(res.body.user).to.haveOwnProperty('email');
        expect(res.body.user).to.haveOwnProperty('password');
        expect(res.body.user).not.to.haveOwnProperty('resetToken');
        expect(res.body.user).not.to.haveOwnProperty('dateToken');
        done();
      });
  });

  it('should to logout', (done) => {
    agent
      .post(`${MOUNT}/auth/exit`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(203);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });

  it('should return books for unlogined users', (done) => {
    agent
      .get(`${MOUNT}/books`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('books');
        done();
      });
  });
});



describe('Book check', () => {

  before((done) => {
    agent
    .post(`${MOUNT}/auth/login`)
    .send({
      email,
      password,
    })
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.json;
      expect(res).to.have.status(200);
      expect(res.body).to.haveOwnProperty('success');
      expect(res.body.success).to.be.true;
      expect(res.body).to.haveOwnProperty('user');
      expect(res.body.user).to.haveOwnProperty('_id');
      expect(res.body.user).to.haveOwnProperty('email');
      expect(res.body.user).to.haveOwnProperty('password');
      done();
    });
  })

  it('should return books for logined users', (done) => {
    agent
      .get(`${MOUNT}/books`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('books');
        done();
      });
  });

  it('should add a new book', (done) => {
    agent
      .put(`${MOUNT}/books/newbook`)
      .send({
        title,
        author,
        isfinished,
        notes,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(201); 
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('book');
        expect(res.body.book).to.haveOwnProperty('id');
        expect(res.body.book).to.haveOwnProperty('title');
        expect(res.body.book).to.haveOwnProperty('author');
        expect(res.body.book).to.haveOwnProperty('isfinished');
        expect(res.body.book).to.haveOwnProperty('notes');
        expect(res.body.book).to.haveOwnProperty('createdat');
        bookid = res.body.book.id.toString();
        done();
      });
  });
  
  it('should add book to user libriary', (done) => {
    agent 
     .post(`${MOUNT}/books/own`)
     .send({
       id: bookid,
     })
     .end((err, res) => {
       expect(err).to.be.null;
       expect(res).to.be.json;
       expect(res).to.have.status(201);
       expect(res.body).to.haveOwnProperty('success');
       expect(res.body.success).to.be.true;
       expect(res.body).to.haveOwnProperty('user');
       expect(res.body.user.books).not.to.be.empty;
       done();
     })
  })

  it('should return user\'s books', (done) => {
    agent
      .post(`${MOUNT}/books/own`)
      .send({
        filterBy: 'isfinished',
        isfinished: false,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.have.ownProperty('books');
        done();
      });
  });
 
  it('should return info about book', (done) => {
    agent
      .get(`${MOUNT}/books/${bookid}/info`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('book');
        expect(res.body.book).to.haveOwnProperty('title')
        expect(res.body.book).to.haveOwnProperty('author');
        expect(res.body.book).to.haveOwnProperty('isfinished');
        expect(res.body.book).to.haveOwnProperty('notes');
        expect(res.body.book).to.haveOwnProperty('userid');
        done();
      });
  });

  it('should edit some book', (done) => {
    let title = faker.fake('Test');
    agent
      .patch(`${MOUNT}/books/${bookid}/edit`)
      .send({
        title,
        author: faker.internet.userName('Taras', 'Shevchenko'),
        isfinished: faker.random.boolean(),
        notes: faker.random.words(20),
        userid: id,
      })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('book');
        expect(res.body.book).to.haveOwnProperty('title');
        expect(res.body.book.title).not.to.be.equal(title);
        expect(res.body.book).to.haveOwnProperty('createdat');
        expect(res.body.book).to.haveOwnProperty('updatedat');
        done();
      });
  });

  it('should delete some book', (done) => {
    agent
      .delete(`${MOUNT}/books/${bookid}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(205);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        done();
      });
  });
});


describe('Profile',() => {

  it('should change avatar', (done) => {
    agent
      .post(`${MOUNT}/profile`)
      .set('Content-Type', 'multipart/form-data')
      .attach('avatar', fs.readFileSync(`${__dirname}/assets/2579.jpg`),{ filename: 'avatar.jpg', contentType:'image/jpg'})
      .type('form')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(201);
        expect(res.body).to.haveOwnProperty('success');
        expect(res.body.success).to.be.true;
        expect(res.body).to.haveOwnProperty('user');
        expect(res.body.user).to.haveOwnProperty('avatar');
        process.emit('Finish');
        done();
      })
    })
})



process.on('Finish', () => {
  setTimeout(() => {
    process.exit(0);
  },2000);
})