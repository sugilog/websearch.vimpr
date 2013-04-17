var INFO =
xml`<plugin
  name="webSearch"
  version="0.2.1"
  href="http://github.com/sugilog"
  summary="vimperator plugin for user customisable web search commands"
  xmlns="http://vimperator.org/namespaces/liberator"
>
  <author email="sugilog@gmail.com">sugilog</author>
  <license>MPL 1.1/GPL 2.0/LGPL 2.1</license>
  <project name="Vimperator" minVersion="2.3"/>
  <item>
  <tags>:[custom command]</tags>
  <spec>:[custom command] <a>keyword</a></spec>
  <description>
    <p>user custom command to search with keyword on web searvice</p>
    <p>command without bang will be searched with new tab as default</p>
    <p>command with bang will be searched with current tab as default</p>
  </description>
  </item>
</plugin>`

// ref: http://vimperator.g.hatena.ne.jp/teramako/20110303/1299154988
// ref: copy.js

liberator.plugins.webSearch = (function() {
  if (typeof liberator.globalVariables.webSearchTemplates == 'undefined') {
    liberator.globalVariables.webSearchTemplates = [];
  }

  var templates = [
    { names: 'alc', description: 'search alc', url: 'http://eow.alc.co.jp/%KEYWORD%/UTF-8/', tabOpen: true, urlWithoutKeyword: 'http://www.alc.co.jp' }
  ];

  templates = templates.concat(
    liberator.globalVariables.webSearchTemplates.map(function(t) {
      return { names: t.names, description: t.description, url: t.url, tabOpen: t.tabOpen, urlWithoutKeyword: t.urlWithoutKeyword }
    })
  );

  templates.forEach(function(template) {
    if (typeof template.names == 'string') {
      template.names = [template.names];
    }

    if (typeof template.urlWithoutKeyword == 'undefined') {
      if (template.url.match(/^((http|https):\/\/[a-z0-9.:@-]+\/)/i)) {
        template.urlWithoutKeyword = RegExp.$1;
      }
    }

    commands.addUserCommand(
      template.names,
      template.description,
      function(arg) {
        if (arg == '') {
          openWithoutKeyword(template.urlWithoutKeyword, tabOpenStatus(arg.bang, template.tabOpen));
        }
        else {
          openWithKeyword(template.url, arg, tabOpenStatus(arg.bang, template.tabOpen));
        }
      },
      {
        argCount : ((typeof template.urlWithoutKeyword == 'undefined') ? '+' : '*'),
        bang     : true
      },
      true
    );

    if (typeof template.urlWithoutKeyword != 'undefined') {
      liberator.modules.quickmarks.add(template.names[0][0], template.urlWithoutKeyword);
    }
  });

  var openWithKeyword = function(url, keyword, tabOpen) {
    liberator.open(
      url.replace(/%KEYWORD%/, keyword.join('+')),
      ((tabOpen) ? liberator.NEW_TAB : liberator.CURRENT_TAB)
    );
  }

  var openWithoutKeyword = function(url, tabOpen) {
    liberator.open(
      url,
      ((tabOpen) ? liberator.NEW_TAB : liberator.CURRENT_TAB)
    );
  }

  var tabOpenStatus = function(bang, userSetting) {
    if (typeof userSetting == 'undefined') {
      return !bang;
    }
    else {
      return ((userSetting) ? !bang : bang);
    }
  }
})();

