'use strict'

// var $ = require('nd-jquery')
var chai = require('chai')
var sinonChai = require('sinon-chai')
var Pagination = require('../index')

var expect = chai.expect
// var sinon = window.sinon

chai.use(sinonChai)

/*globals describe,it*/

describe('Pagination', function() {

  it('function', function() {
    expect(Pagination).to.be.a('function')
  })

})
