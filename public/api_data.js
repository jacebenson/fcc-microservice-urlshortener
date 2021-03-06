define({ "api": [
  {
    "type": "get",
    "url": "/:number",
    "title": "",
    "name": "GetURL",
    "version": "1.0.0",
    "group": "Get",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://url-svc.glitch.me/5",
        "type": "curl"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-response",
          "content": "HTTP/1.1 200 OK\nConnection: keep-alive\nContent-Type: application/json\nDate: Wed, 25 Jan 2017 17:48:28 GMT\nLocation: http://google.com\nServer: Cowboy\nTransfer-Encoding: chuncked\nVia: 1.1 vegur",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "Get"
  },
  {
    "type": "get",
    "url": "/new/:url",
    "title": "",
    "name": "Insert_URL",
    "version": "1.0.0",
    "group": "New",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl http://url-svc.glitch.me/new/https://google.com",
        "type": "curl"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "url",
            "description": "<p>URL to add.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "shortURL",
            "description": "<p>information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shortURL._id",
            "description": "<p>mongoDB id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shortURL.original_url",
            "description": "<p>Original URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shortURL.id",
            "description": "<p>ID used for short URL</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shortURL.short_url",
            "description": "<p>Short URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-response",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"588464016d933500047cb0f6\",\n    \"original_url\": \"http://google.com\",\n    \"id\": 5\n    \"short_url\": \"http://url-svc.glitch.me/5\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "app/routes/api.js",
    "groupTitle": "New"
  }
] });
