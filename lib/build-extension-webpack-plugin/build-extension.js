var fs = require('fs-extra');
var path = require('path');
var archiver = require('archiver');
var BuildPaths = require('../build-paths');

function copyTheme(darkness, list) {
  var paths = [];
  list.forEach(function(theme) {
    var themeCSS = theme.replace(/\.js$/, '.css');
    var themeCSSPath = 'themes/' + darkness + '/' + theme + '.css';
    var themePath = path.join(BuildPaths.EXTENSION, 'assets/' + theme);

    if (fs.existsSync(themePath + '.js') && fs.existsSync(themePath + '.css')) {
      fs.removeSync(themePath + '.js');
      fs.copySync(themePath + '.css', path.join(BuildPaths.EXTENSION, themeCSSPath));
      
      paths.push(themeCSSPath);

    } else {
      console.error('  fail to copy: ' + (themePath + '.css'));
    }
  });

  return paths;
}

function BuildExtension() {}
BuildExtension.prototype.apply = function(compiler) {
  compiler.hooks.done.tap('BuildExtension', () => {
    
    
    fs.copySync(path.join(BuildPaths.SRC_ROOT, 'icons'), path.join(BuildPaths.EXTENSION, 'icons'));
    fs.copySync(path.join(BuildPaths.SRC_ROOT, 'pages'), path.join(BuildPaths.EXTENSION, 'pages'));
    fs.copySync(path.join(BuildPaths.SRC_ROOT, 'assets/background.js'), path.join(BuildPaths.EXTENSION, 'assets/background.js'));

    

    var availableThemes = require('../../webpack.config').themes || {light: [], dark: []};
    var themesCSSPaths = copyTheme('light', availableThemes.light).
                         concat(copyTheme('dark', availableThemes.dark));

    var manifest = fs.readJSONSync(path.join(BuildPaths.SRC_ROOT, 'manifest.json'));
    manifest.web_accessible_resources = manifest.web_accessible_resources.concat(themesCSSPaths);

    if (process.env.NODE_ENV !== 'production') {
      
      manifest.name += ' - dev';
    }

    
    fs.outputJSONSync(path.join(BuildPaths.EXTENSION, 'manifest.json'), manifest);
  });
}

module.exports = BuildExtension;
