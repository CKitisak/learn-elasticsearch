# Learn Elasticsearch

My quick summary on Elasticsearch. for more information,
please go to [Elasticsearch website](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html)

Demo data used in this example [download here](https://github.com/elastic/elasticsearch/blob/master/docs/src/test/resources/accounts.json?raw=true) or you can generate them from [this link](www.json-generator.com)

## Example Search Query:

returns all accounts

```json
{
  "query": { "match_all": {} }
}
```

returns one account

```json
{
  "query": { "match_all": {} },
  "size": 1
}
```

returns accounts 10 through 19

```json
{
  "query": { "match_all": {} },
  "from": 10,
  "size": 10
}
```

returns the top 10 (default size) accounts

```json
{
  "query": { "match_all": {} },
  "sort": { "balance": { "order": "desc" } }
}
```

return two fields, account_number and balance

```json
{
  "query": { "match_all": {} },
  "_source": ["account_number", "balance"]
}
```

returns all accounts containing the term "mill" or "lane" in the address

```json
{
  "query": { "match": { "address": "mill lane" } }
}
```

returns all accounts containing the phrase "mill lane" in the address

```json
{
  "query": { "match_phrase": { "address": "mill lane" } }
}
```

returns all accounts containing "mill" and "lane" in the address

```json
{
  "query": {
    "bool": {
      "must": [{ "match": { "address": "mill" } }, { "match": { "address": "lane" } }]
    }
  }
}
```

returns all accounts containing "mill" or "lane" in the address

```json
{
  "query": {
    "bool": {
      "should": [{ "match": { "address": "mill" } }, { "match": { "address": "lane" } }]
    }
  }
}
```

returns all accounts that contain neither "mill" nor "lane" in the address

```json
{
  "query": {
    "bool": {
      "must_not": [{ "match": { "address": "mill" } }, { "match": { "address": "lane" } }]
    }
  }
}
```

returns all accounts of anybody who is 40 years old but doesn’t live in ID(aho)

```json
{
  "query": {
    "bool": {
      "must": [{ "match": { "age": "40" } }],
      "must_not": [{ "match": { "state": "ID" } }]
    }
  }
}
```

return all accounts with balances between 20000 and 30000

```json
{
  "query": {
    "bool": {
      "must": { "match_all": {} },
      "filter": {
        "range": {
          "balance": {
            "gte": 20000,
            "lte": 30000
          }
        }
      }
    }
  }
}
```

## Example Aggregations Query

groups all the accounts by state, and then returns the top 10 (default) states sorted by count descending

```json
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      }
    }
  }
}
```

calculates the average account balance by state (again only for the top 10 states sorted by count in descending order)

```json
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword"
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
```

calculates the average account balance by state (again only for the top 10 states sorted by count in descending order) and sort on the average balance in descending order

```json
{
  "size": 0,
  "aggs": {
    "group_by_state": {
      "terms": {
        "field": "state.keyword",
        "order": {
          "average_balance": "desc"
        }
      },
      "aggs": {
        "average_balance": {
          "avg": {
            "field": "balance"
          }
        }
      }
    }
  }
}
```

group by age brackets (ages 20-29, 30-39, and 40-49), then by gender, and then finally get the average account balance, per age bracket, per gender

```json
{
  "size": 0,
  "aggs": {
    "group_by_age": {
      "range": {
        "field": "age",
        "ranges": [
          {
            "from": 20,
            "to": 30
          },
          {
            "from": 30,
            "to": 40
          },
          {
            "from": 40,
            "to": 50
          }
        ]
      },
      "aggs": {
        "group_by_gender": {
          "terms": {
            "field": "gender.keyword"
          },
          "aggs": {
            "average_balance": {
              "avg": {
                "field": "balance"
              }
            }
          }
        }
      }
    }
  }
}
```
