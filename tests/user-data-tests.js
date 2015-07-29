var chai = require('chai');
var expect = chai.expect;
var Users = require('../user-data');
var Loki = require('lokijs');

var users;

// Add /tests/ dir due to cwd being root of student-files
var db = new Loki('./tests/data/user-test-data.json');

var userData = new Users(db);

describe('user data module tests', function() {
  before(function(done) {
    setTimeout(function() {
      users = db.getCollection('users');
      done();
    }, 500);
  });

  beforeEach(function() {
    if (users) {
      users.removeDataOnly();
    }
  });

  it('should save a new user with addUser', function() {
    var name = 'Sam',
      number = 55,
      starred = false;
    userData.addUser(name, number, starred);

    var sam = users.find({
      name: name
    })[0];

    expect(sam.name).to.equal(name);
    expect(sam.starred).to.equal(starred);
    expect(sam.favoriteNumber).to.equal(number);
  });

  it('should get a user by name with getUser', function() {
    var name = 'Jane',
      number = 30,
      starred = true,
      actual;

    users.insert({
      name: name,
      favoriteNumber: number,
      starred: starred,
    });

    db.save();

    actual = userData.getUser(name)[0];

    expect(actual.name).to.equal(name);
    expect(actual.favoriteNumber).to.equal(number);
    expect(actual.starred).to.equal(starred);
  });

  it('should get a user by number with getUser', function() {
    var name = 'Jeanette',
      number = 24,
      starred = false,
      actual;

    users.insert({
      name: name,
      favoriteNumber: number,
      starred: starred,
    });

    db.save();

    actual = userData.getUser(number)[0];

    expect(actual.name).to.equal(name);
    expect(actual.favoriteNumber).to.equal(number);
    expect(actual.starred).to.equal(starred);
  });

  it('should return all users with getAllUsers', function() {
    var name = 'Jane',
      number = 30,
      starred = true;

    users.insert({
      name: name,
      favoriteNumber: number,
      starred: starred,
    });

    db.save();

    var useFind = users.find({});
    var useMethod = userData.getUsers();

    expect(useFind).to.equal(useMethod);
  });

});