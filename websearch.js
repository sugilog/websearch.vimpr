var INFO =
<plugin
  name="webSearch"
  version="0.0.1"
  href="http://github.com/sugilog"
  summary="vimperator plugin for user customisable web search commands"
  xmlns="http://vimperator.org/namespaces/liberator"
>
  <author email="sugilog@gmail.com">teramako</author>
  <license>MPL 1.1/GPL 2.0/LGPL 2.1</license>
  <project name="Vimperator" minVersion="2.3"/>
  <item>
    <tags>webSearchTemplates</tags>
    <spec>webSearchTemplates</spec>
    <description>
      <p>user customisable template</p>
      <code><![CDATA[
javascript <<EOM
liberator.globalVariables.webSearchTemplates = [
  { names: ['alc'], description: 'search alc', url: 'http://eow.alc.co.jp/%KEYWORD%/UTF-8/' }
];
EOM
      ]]></code>
    </description>
  </item>
</plugin>

// ref: http://vimperator.g.hatena.ne.jp/teramako/20110303/1299154988
// ref: copy.js

liberator.plugins.webSearch = (function(){
  var templates = [];
  liberator.globalVariables.webSearchTemplates = [
    { names: ['alc'], description: 'search alc', url: 'http://eow.alc.co.jp/%KEYWORD%/UTF-8/' }
  ];

  templates = liberator.globalVariables.webSearchTemplates.map(function(t){
      return { names: t.names, description: t.description, url: t.url }
  });

  templates.forEach(function(template){
    commands.addUserCommand(
      template.names,
      template.description,
      function(arg){
        open(template.url, arg, arg.bang);
      },
      {
        argCount : 1,
        bang     : true
      },
      true
    );
  });

  var open = function(templateUrl, keyword, tabOpen){
    liberator.open(
      templateUrl.replace(/%KEYWORD%/, keyword),
      ((tabOpen) ? liberator.NEW_TAB : liberator.CURRENT_TAB)
    );
  }
})();
