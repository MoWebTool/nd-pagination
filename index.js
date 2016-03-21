/**
 * @module Pagination
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var __ = require('nd-i18n');
var Widget = require('nd-widget');
var Template = require('nd-template');

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
  n7 = Math.max(n7, (useMiddle ? n5 : n2) + 1);
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
    // none| basic | floating | simple
    theme: 'simple'
  },

  events: {
    'click [data-role="page-link"]': function(e) {
      //元素被禁用时阻止跳转
      if (e.currentTarget.getAttribute('disabled') === '') {
        return;
      }
      var pageText = e.currentTarget.getAttribute('data-page'),
        theme = this.get('theme'),
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

      if (toPage >= 1 && toPage !== currentPage && (toPage <= pageCount || theme === 'none')) {
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

    var pageList = [];
    var theme = this.get('theme');
    var $limit = this.get('$limit');
    var total = this.get('count');
    var pageCount = Math.ceil(total / $limit);
    var currentPage = Math.floor(this.get('$offset') / $limit) + 1;

    if (theme === 'none') {
      pageList.push({
        page: '-1',
        text: __('< 上一页'),
        cls: 'prev',
        disabled: currentPage === 1
      });

      pageList.push({
        page: '+1',
        text: __('下一页 >'),
        cls: 'next',
        disabled: this.get('isLastPage')
      });
    } else if (pageCount) {
      pageList.push({
        page: '-1',
        text: '<',
        cls: 'prev',
        disabled: currentPage === 1
      });

      switch (theme) {
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
      total: total,
      pageList: pageList,
      showJump: !!pageCount
    });
  }

});

module.exports = Pagination;
