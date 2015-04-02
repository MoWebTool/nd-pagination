/**
 * @module: nd-pagination
 * @author: crossjs <liwenfu@crossjs.com> - 2015-03-16 13:28:48
 */

'use strict';

var Widget = require('nd-widget'),
  Template = require('nd-template');

// https://github.com/shadowhand/pagination/blob/3.1/master/views/pagination/floating.php
function makeFloating(pageList, pageCount, currentPage) {
  var countOut = 2;
  var countIn = 2;

  var n1 = 1;
  var n2 = Math.min(countOut, pageCount);

  var n7 = Math.max(1, pageCount - countOut + 1);
  var n8 = pageCount;

  var n4 = Math.max(n2 + 1, currentPage - countIn);
  var n5 = Math.min(n7 - 1, currentPage + countIn);
  var useMiddle = (n5 >= n4);

  // var n3 = parseInt((n2 + n4) / 2, 10);
  var useN3 = (useMiddle && ((n4 - n2) > 1));

  // var n6 = parseInt((n5 + n7) / 2, 10);
  var useN6 = (useMiddle && ((n7 - n5) > 1));

  var i;

  for (i = n1; i <= n2; i++) {
    pageList.push({
      page: i,
      text: i,
      cls: i === currentPage ? 'current' : ''
    });
  }
  if (useN3) {
    pageList.push({
      text: '...',
      cls: 'hellip'
    });
  }
  for (i = n4; i <= n5; i++) {
    pageList.push({
      page: i,
      text: i,
      cls: i === currentPage ? 'current' : ''
    });
  }
  if (useN6) {
    pageList.push({
      text: '...',
      cls: 'hellip'
    });
  }
  for (i = n7; i <= n8; i++) {
    pageList.push({
      page: i,
      text: i,
      cls: i === currentPage ? 'current' : ''
    });
  }
}

var Pagination = Widget.extend({

  // 使用 handlebars
  Implements: [Template],

  attrs: {
    classPrefix: 'ui-pagination',
    template: require('./src/pagination.handlebars'),
    // basic | floating | simple
    theme: 'simple'
  },

  events: {
    'click [data-role="page-link"]': function(e) {
      var pageText = e.currentTarget.getAttribute('data-page'),
        currentPage = this.get('currentPage'),
        pageCount = this.get('pageCount'),
        toPage;

      if (pageText === '+1') {
        toPage = currentPage + 1;
      } else if (pageText === '-1') {
        toPage = currentPage - 1;
      } else {
        toPage = +pageText;
      }

      if (toPage >= 1 && toPage !== currentPage && toPage <= pageCount) {
        this.trigger('goto', toPage);
      }
    },
    'submit': function(e) {
      e.preventDefault();

      var toPage = +this.$('input').val();

      if (!isNaN(toPage)) {
        if (toPage >= 1 && toPage <= this.get('pageCount')) {
          this.trigger('goto', toPage);
        }
      }
    }
  },

  initAttrs: function() {
    Pagination.superclass.initAttrs.apply(this, arguments);

    var pageList = [],
      limit = this.get('limit'),
      pageCount = Math.ceil(this.get('count') / limit),
      currentPage;

    if (pageCount) {
      currentPage = Math.floor(this.get('offset') / limit) + 1;

      pageList.push({
        page: '-1',
        text: '<',
        cls: 'prev',
        disabled: currentPage === 1
      });

      switch (this.get('theme')) {
        case 'simple':
          pageList.push({
            page: currentPage,
            text: currentPage + '/' + pageCount,
            cls: 'current'
          });
          break;
        case 'basic':
          for (var i = 1; i <= pageCount; i++) {
            pageList.push({
              page: i,
              text: i,
              cls: i === currentPage ? 'current' : ''
            });
          }
          break;
        case 'floating':
          makeFloating(pageList, pageCount, currentPage);
          break;
      }

      pageList.push({
        page: '+1',
        text: '>',
        cls: 'next',
        disabled: currentPage === pageCount
      });
    }

    this.set('currentPage', currentPage);
    this.set('pageCount', pageCount);

    this.set('model', {
      pageList: pageList
    });
  }

});

module.exports = Pagination;
