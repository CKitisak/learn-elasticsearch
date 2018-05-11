const ES = require('elasticsearch');

const client = new ES.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client
  .search({
    index: 'bank',
    body: {
      // query: {
      // bool: {
      //   must: [{ match: { age: '40' } }],
      //   must_not: [{ match: { state: 'ID' } }]
      // }
      // },
      aggs: {
        group_by_age: {
          range: {
            field: 'age',
            ranges: [
              {
                from: 20,
                to: 30
              },
              {
                from: 30,
                to: 40
              },
              {
                from: 40,
                to: 50
              }
            ]
          },
          aggs: {
            group_by_gender: {
              terms: {
                field: 'gender.keyword'
              },
              aggs: {
                average_balance: {
                  avg: {
                    field: 'balance'
                  }
                }
              }
            }
          }
        }
      }
      // _source: ['account_number', 'address'],
      // sort: { account_number: { order: 'asc' } }
    },
    size: 0
  })
  .then(result => {
    // const docs = result.hits.hits.map(d => d._source);
    // const aggs = result.aggregations;
  })
  .catch(error => {
    throw new Error(error);
  });
