var spawn = require('child_process').spawn;
var camelize = require('camelize');
var format = require('util').format;

function fetchFromGitConfig(key) {
    function readValue(values, callback) {
        var called = false;
        var proc = spawn('git', [
            '--bare',
            'config',
            '--global',
            key
        ]);

        proc.stdout.once('data', function (chunk) {
            called = true;
            callback(null, chunk);
        });
        proc.stdout.once('error', callback);
        proc.stdout.once('end', function () {
            if (called) {
                return;
            }

            var message = format('please configure %s in git', key);
            callback(new Error(message));
        });
    }

    return readValue;
}

module.exports = {
    project: 'Project name: ',
    description: 'Project description: ',
    name: fetchFromGitConfig('user.name'),
    email: fetchFromGitConfig('user.email'),
    projectName: function readProjectName(values, callback) {
        callback(null, camelize(values.project));
    }
};
