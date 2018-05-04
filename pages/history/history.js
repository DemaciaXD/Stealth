Page({
  data: {
    list: [
      {
        id: 'view',
        name: '我的提问',
        open: false,
        pages: ['今天吃什么', '今天玩什么', '睡觉还是学习']
      }, {
        id: 'content',
        name: '我的回答',
        open: false,
        pages: ['吃哈', '玩滑板去', '隐身独白']
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})

