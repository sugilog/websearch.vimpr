var INFO =
<plugin
  name="webSearch"
  version="0.1.0"
  href="http://github.com/sugilog"
  summary="vimperator plugin for user customisable web search commands"
  xmlns="http://vimperator.org/namespaces/liberator"
>
  <author email="sugilog@gmail.com">teramako</author>
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
  <item>
    <tags>webSearchTemplates</tags>
    <spec>webSearchTemplates</spec>
    <description>
      <p>user customisable template (it will concat with template in plugin file and)</p>
      <code><![CDATA[
javascript <<EOM
liberator.globalVariables.webSearchTemplates = [
  { names: ['alc'], description: 'search alc', url: 'http://eow.alc.co.jp/%KEYWORD%/UTF-8/', tabOpen: true }
];
EOM
      ]]></code>
      <dl>
        <dt>names</dt>
        <dd>command names. (String Array, required)</dd>
        <dt>description</dt>
        <dd>command description. (String, optional)</dd>
        <dt>url</dt>
        <dd>url for search on web searvice. must have %KEYWORD% to replace keyword. (String, required)</dd>
        <dt>tabOpen</dt>
        <dd>tab open setting, default is true. when tabOpen is false, then toggle tab open behavior. (boolean, optional)</dd>
      </dl>
    </description>
  </item>
</plugin>

// ref: http://vimperator.g.hatena.ne.jp/teramako/20110303/1299154988
// ref: copy.js

liberator.plugins.webSearch = (function(){
  if (typeof liberator.globalVariables.webSearchTemplates == 'undefined') {
    liberator.globalVariables.webSearchTemplates = [];
  }

  var templates = [
    { names: ['alc'], description: 'search alc', url: 'http://eow.alc.co.jp/%KEYWORD%/UTF-8/', tabOpen: true }
  ];

  templates = templates.concat(
    liberator.globalVariables.webSearchTemplates.map(function(t){
      return { names: t.names, description: t.description, url: t.url, tabOpen: t.tabOpen }
    })
  );

  templates.forEach(function(template){
    commands.addUserCommand(
      template.names,
      template.description,
      function(arg){
        open(template.url, arg, tabOpenStatus(arg.bang, template.tabOpen));
      },
      {
        argCount : '+',
        bang     : true
      },
      true
    );
  });

  var open = function(templateUrl, keyword, tabOpen){
    liberator.open(
      templateUrl.replace(/%KEYWORD%/, keyword.join('+')),
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
