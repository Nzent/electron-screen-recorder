module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
              certificateFile: './cert.pfx',
              certificatePassword: 'this-is-a-secret'
            }
          }
    ]
}