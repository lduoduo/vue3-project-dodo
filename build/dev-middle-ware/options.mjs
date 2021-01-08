export default {
  type: 'object',
  properties: {
    mimeTypes: {
      description:
        'Allows a user to register custom mime types or extension mappings.',
      type: 'object'
    },
    writeToDisk: {
      description: 'Allows to write generated files on disk.',
      anyOf: [
        {
          type: 'boolean'
        },
        {
          instanceof: 'Function'
        }
      ]
    },
    methods: {
      description:
        'Allows to pass the list of HTTP request methods accepted by the middleware.',
      type: 'array',
      items: {
        type: 'string',
        minlength: '1'
      }
    },
    headers: {
      type: 'object'
    },
    publicPath: {
      description:
        'The `publicPath` specifies the public URL address of the output files when referenced in a browser.',
      anyOf: [
        {
          enum: ['auto']
        },
        {
          type: 'string'
        },
        {
          instanceof: 'Function'
        }
      ]
    },
    serverSideRender: {
      description:
        'Instructs the module to enable or disable the server-side rendering mode.',
      type: 'boolean'
    },
    outputFileSystem: {
      description:
        'Set the default file system which will be used by webpack as primary destination of generated files.',
      type: 'object'
    },
    index: {
      description: 'Allows to serve an index of the directory.',
      anyOf: [
        {
          type: 'boolean'
        },
        {
          type: 'string',
          minlength: '1'
        }
      ]
    }
  },
  additionalProperties: false
};
