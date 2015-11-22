/// <binding BeforeBuild='exec:update, copy:main' AfterBuild='exec:package' ProjectOpened='exec:update, copy:main' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        exec: {
            package: {
                command: "vset package -s settings.vset.json",
                stdout: true,
                stderr: true
            },
            update: {
                command: "npm up --save-dev",
                stdout: true,
                stderr: true
            },
            publish: {
                command: "vset publish -s settings.vset.json",
                stdout: true,
                stderr: true
            }
        },
        copy: {
            main: {
                files: [
                  // includes files within path
                  { expand: true, flatten: true, src: ['node_modules/vss-sdk/lib/VSS.SDK.js'], dest: 'scripts/', filter: 'isFile' },
                  //{ expand: true, flatten: true, src: ['node_modules/vss-sdk/typings/VSS.d.ts'], dest: 'scripts/ref', filter: 'isFile' },
                   // { expand: true, flatten: true, src: ['node_modules/vss-sdk/typings/TFS.d.ts'], dest: 'scripts/ref', filter: 'isFile' }
                ]
            }
        },
        jasmine: {
            src: ["scripts/**/*.js", "sdk/scripts/*.js"],
            specs: "test/**/*[sS]pec.js",
            helpers: "test/helpers/*.js"
        }
    });

    grunt.loadNpmTasks("grunt-exec");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jasmine");

};