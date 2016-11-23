'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var askName = require('inquirer-npm-name');
var extend = require('deep-extend');


module.exports = yeoman.Base.extend({

    initializing: function() {
        this.props = {};
    },

    prompting: function () {
        // Have Yeoman greet the user.
        this.log(yosay(
            chalk.red('Typescript + React + Flux/Redux? + Webpack') + ' generator'
        ));

        return askName({
            name: 'name',
            message: 'Your generator name',
            default: path.basename(process.cwd()),
            validate: function (str) {
                //TODO: MMmmm?
                return true;
            }
        }, this).then(function (props) {
            this.props.name = props.name;
        }.bind(this));
    },

    defaults: function() {
        this.composeWith('node:app', {
            options: {
                babel: false,
                boilerplate: false,
                gulp: false,
                name: this.props.name,
                skipInstall: this.options.skipInstall
            }
        }, {
            local: require('generator-node').app
        });
    },

    writing: function () {
        var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
        extend(pkg, {
            "dependencies": {
                "@types/react": "^0.14.50",
                "@types/react-dom": "^0.14.19",
                "react": "^15.4.0",
                "react-dom": "^15.4.0"
            },
            "devDependencies": {
                "source-map-loader": "^0.1.5",
                "ts-loader": "^1.2.2",
                "webpack": "^1.13.3",
                "webpack-dev-server": "^1.16.2"
            },
            "scripts": {
                "start": "webpack-dev-server --inline"
            }
        });
        pkg.keywords = pkg.keywords || [];
        pkg.keywords.push('yeoman-generator');

        this.fs.writeJSON(this.destinationPath('package.json'), pkg);

        mkdirp('src/components');
        mkdirp('dist');

        _.each(
            [
                'index.html',
                'tsconfig.json',
                'webpack.config.js',
                'src/index.tsx',
            ], function(f) {
                this.fs.copy(this.templatePath(f), this.destinationPath(f));
            }.bind(this)
        );
    },

    install: function () {
        this.npmInstall(null, {'only': 'production'});
    }
});
