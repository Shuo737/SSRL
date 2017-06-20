{
  "id": "root",
  "children": [ {
    "id": "config",
    "table2": "north_points_benben",
    "table2_pk": "uid_join",
    "table2_fk": "uid_join",
    "table2_name": "place_and_region",
    "table2_where": ""
  },
  {
    "id": "lyr_var",
    "text":"Stats Layers",
    "children": [
      {
        "id":"household",
        "text":"Household",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"household_size",
            "text":"Census Household Size (1 ~ 6+ persons)",
            "type":"item",
            "server":{
              "table1": "north_dwelling_persons_per_household",
              "table1_id": "uid_join",
              "table1_fields": ["one","two","three","four","five","over_five","color","comments"],
              "table1_fieldNames": ["1<i class='icon icon-person'></i>","2<i class='icon icon-person'></i>","3<i class='icon icon-person'></i>","4<i class='icon icon-person'></i>","5 <i class='icon icon-person'></i>",">5<i class='icon icon-person'></i>", "Color", "Comments"],
              "chart": "pie"
            },
            "desc": ""
          },
          {
            "id":"household_sz",
            "text":"Average Household Size",
            "type":"item",
            "server":{
              "table1": "north_dwelling_ave_household_size",
              "table1_id": "uid_join",
              "table1_fields": ["ave_size","color","comments"],
              "table1_fieldNames": ["Average Size", "Color", "Comments"],
              "chart": "bar"
            },
            "desc": "Description for Average Household Size"
          },
          {
            "id":"household_private_no",
            "text":"No. of Private Households",
            "type":"item",
            "server":{
              "table1": "north_dwelling_private_household",
              "table1_id": "uid_join",
              "table1_fields": ["private","color","comments"],
              "table1_fieldNames": ["Households", "Color", "Comments"],
              "chart": "bar"
            },
            "desc": ""
          },
          {
            "id":"household_band",
            "text":"Band Housing",
            "type":"item",
            "server":{
              "table1": "north_dwelling_band_housing_total",
              "table1_id": "uid_join",
              "table1_fields": ["band","color","comments"],
              "table1_fieldNames": ["Band Size", "Color", "Comments"],
              "chart": "bar"
            },
            "desc": "Description for Band Housing"
          },
          {
            "id":"household_value",
            "text":"Average value of owned dwelling",
            "type":"item",
            "server":{
              "table1": "north_dwelling_value",
              "table1_id": "uid_join",
              "table1_fields": ["ave_value","color","comments"],
              "table1_fieldNames": ["Average Value", "Color", "Comments"],
              "chart": "bar"
              },
            "desc": ""
          },
          {
            "id": "household_dwelling_char",
            "text": "Dwelling Type Characteristics",
            "type": "group",
            "children":[
              {
                "id":"household_dwelling_char_cnt",
                "text":"Census Dwelling Counts",
                "type":"group",
                "children":[
                  {
                    "id":"household_dwelling_char_cnt_prvt",
                    "text":"No. of Private Dwellings",
                    "type":"item",
                    "server":{
                      "table1": "north_dwelling_counts",
                      "table1_id": "uid_join",
                      "table1_fields": ["private","color","comments"],
                      "table1_fieldNames": ["Households #", "Color", "Comments"],
                      "chart": "bar"
                    },
                    "desc": ""
                  },
                  {
                    "id":"household_dwelling_char_cnt_usu",
                    "text":"No. of Dwellings Occupied by Usual Resident",
                    "type":"item",
                    "server":{
                      "table1": "north_dwelling_counts",
                      "table1_id": "uid_join",
                      "table1_fields": ["usual","color","comments"],
                      "table1_fieldNames": ["Households #", "Color", "Comments"],
                      "chart": "bar"
                    },
                    "desc": ""
                  }
                ]
              },
              {
                "id":"household_dwelling_char_tenure",
                "text":"Occupied Dwelling Tenure",
                "type":"item",
                "server":{
                  "table1": "north_dwelling_tenure",
                  "table1_id": "uid_join",
                  "table1_fields": ["owned","rented","color","comments"],
                  "table1_fieldNames": ["Owned", "Rented", "Color", "Comments"],
                  "chart": "pie"
                  },
                "desc": "Description for dwelling tenure"
              }
            ]
          },
          {
            "id":"household_prvt_char",
            "text":"Private Household Characteristics",
            "type":"group",
            "children":[
              {
              "id":"household_prvt_char_period",
              "text":"No. of dwellings by construction period",
              "type":"item",
              "server":{
                  "table1": "north_dwelling_period_of_construction_fix",
                  "table1_id": "uid_join",
                  "table1_fields": ["value","color","comments"],
                  "table1_fieldNames": ["Dwelling", "Color", "Comments"],
                  "chart": "bar"
                },
                "desc": "Number dwellings by period of construction"
              },
              {
              "id":"household_prvt_char_cond",
              "text":"No. of dwellings by condition",
              "type":"item",
              "server":{
                  "table1": "north_dwelling_private_dwelling_by_condition",
                  "table1_id": "uid_join",
                  "table1_fields": ["prc","color","comments"],
                  "table1_fieldNames": ["Major repairs needed %", "Color", "Comments"],
                  "chart": "bar"
                },
                "desc": "Percentage of dwellings in need of major repairs"
              },
              {
              "id":"household_prvt_char_suit",
              "text":"No. of dwellings by housing suitability",
              "type":"item",
              "server":{
                  "table1": "north_dwelling_housing_suitability",
                  "table1_id": "uid_join",
                  "table1_fields": ["prc","color","comments"],
                  "table1_fieldNames": ["Non-suitable %", "Color", "Comments"],
                  "chart": "bar"
                },
                "desc": "Percentage of dwellings not suitable for housing"
              }
            ]
          }
        ]
      },
      {
        "id":"pop",
        "text":"Population",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"pop_subside",
            "text":"% Tenants in Subsidized Housing",
            "type":"item",
            "server":{
              "table1": "north_dwelling_percentage_of_subside_housing",
              "table1_id": "uid_join",
              "table1_fields": ["subside","color","comments"],
              "table1_fieldNames": ["Subsidized %", "Color", "Comments"],
              "chart": "bar"
            },
            "desc": ""
          },
          {
            "id":"pop_census",
            "text":"Population Census",
            "type":"item",
            "server":{
              "table1": "north_pop_census",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["female","male","color","comment"],
              "table1_fieldNames": ["Female","Male","Color", "Comments"]
            },
            "desc": "Population Census Data"
          },
          {
            "id":"pop_med_age",
            "text":"Population Median Age",
            "type":"item",
            "server":{
              "table1": "north_pop_med_age",
              "table1_id": "uid_join",
              "chart": "bar",
              "table1_fields": ["median_age","color","comments"],
              "table1_fieldNames": ["Median Age","Color", "Comments"]
            },
            "desc": "Population Median Age Data"
          },
          {
            "id":"pop_origin",
            "text":"Population Origin Characteristics",
            "type":"group",
            "children":[
                {
                "id":"pop_origin_ab_non",
                "text":"Aboriginal and Non-Aboriginal",
                "type":"item",
                "server":{
                  "table1": "north_pop_ab_non",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["ab","non_ab","color","comments"],
                  "table1_fieldNames": ["Aboriginal Population","Non-Aboriginal Population","Color", "Comments"]
                  },
                  "desc": "Aboriginal and Non-Aboriginal Population Data"
                },
                {
                "id":"pop_origin_first_metis",
                "text":"First Nation and Metis",
                "type":"item",
                "server":{
                  "table1": "north_pop_first_metis",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["first","metis","color","comments"],
                  "table1_fieldNames": ["First Nation Population","Metis Population","Color", "Comments"]
                  },
                  "desc": "First Nation and Metis Population"
                },
                {
                "id":"pop_origin_status_indian",
                "text":"Status Indians",
                "type":"item",
                "server":{
                  "table1": "north_pop_registered_treaty_indian_status",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["reg","non_reg","color","comments"],
                  "table1_fieldNames": ["Status Indian","Non-Status Indian","Color", "Comments"]
                  },
                  "desc": "Status Indians include Registered or Treaty Indians. "
                }
            ]
          },
          {
            "id":"pop_generation_status",
            "text":"Generation Status",
            "type":"item",
            "server":{
              "table1": "north_pop_generation_status",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["prc_1g","prc_2g","prc_3g","color","comments"],
              "table1_fieldNames": ["1<sup>st</sup> Generation %","2<sup>nd</sup> Generation %","3<sup>rd</sup> Generation %","Color", "Comments"],
              "percent": true
            },
            "desc": "Generation Status in Canada Population 15+"
          }
        ]
      },
      {
        "id":"family",
        "text":"Family",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"family_lone_parent",
            "text":"Lone Parent Families",
            "type":"item",
            "server":{
              "table1": "north_family_lone_parent_families",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["female","male","color","comments"],
              "table1_fieldNames": ["Female Lone Parent Families","Male Lone Parent Families","Color", "Comments"]
            },
            "desc": "Number of Lone Parent Families by Gender"
          },
          {
            "id":"family_private_household",
            "text":"No. of Census Families in Private Household",
            "type":"item",
            "server":{
              "table1": "north_family_private_household",
              "table1_id": "uid_join",
              "chart": "bar",
              "table1_fields": ["private","color","comments"],
              "table1_fieldNames": ["Number of Census Families in Private Household","Color", "Comments"]
            },
            "desc": "Number of Census Families in Private Household"
          },
          {
            "id":"family_dependency_ratio",
            "text":"Dependency Ratios Populations",
            "type":"item",
            "server":{
              "table1": "north_family_dependency",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["age0_19","age20_64","age65_","color","comments"],
              "table1_fieldNames": ["Age 0-19","Age 20-64","Age 65+","Color", "Comments"]
            },
            "desc": ""
          }
        ]
      },
      {
        "id":"lan",
        "text":"Language",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"lan_mother_tongue",
            "text":"Mother Tongue",
            "type":"item",
            "server":{
              "table1": "north_lang_mother",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["en","fr","other","color","comments"],
              "table1_fieldNames": ["English","French","Aboriginal/Other","Color", "Comments"]
            },
            "desc": ""
          },
          {
            "id":"lan_home",
            "text":"Home Language",
            "type":"item",
            "server":{
              "table1": "north_lang_home",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["en","fr","other","color","comments"],
              "table1_fieldNames": ["English","French","Aboriginal/Other","Color", "Comments"]
            },
            "desc": ""
          },
          {
            "id":"lan_vitality",
            "text":"Language Vitality Indicator",
            "type":"item",
            "server":{
              "table1": "north_lang_vitality",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["en","fr","ab","color","comments"],
              "table1_fieldNames": ["English","French","Aboriginal","Color", "Comments"]
            },
            "desc": "Language Vitality Indicator = Home Language/Mother Tongue"
          },
          {
            "id":"lan_work",
            "text":"Language at Work",
            "type":"group",
            "children":[
              {
                "id":"lan_work_ab",
                "text":"Aboriginal Language",
                "type":"item",
                "server":{
                  "table1": "north_lang_work",
                  "table1_id": "uid_join",
                  "chart": "bar",
                  "table1_fields": ["prc_ab","color","comments"],
                  "table1_fieldNames": ["Aboriginal (%)","Color", "Comments"]
                },
                "desc": "Percentage of Aboriginal Language Used at Work"
              },
              {
                "id":"lan_work_non_ab",
                "text":"Non-Aboriginal Language",
                "type":"item",
                "server":{
                  "table1": "north_lang_work",
                  "table1_id": "uid_join",
                  "chart": "bar",
                  "table1_fields": ["prc_non_ab","color","comments"],
                  "table1_fieldNames": ["Non-Aboriginal (%)","Color", "Comments"]
                },
                "desc": "Percentage of Non-Aboriginal Language Used at Work"
              }
            ]
          }
        ]
      },
      {
        "id":"work",
        "text":"Workforce",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"work_census_labour",
            "text":"Census Labour Statistics",
            "type":"item",
            "server":{
              "table1": "north_work_emp",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["employed","unemployed","non_labour","color","comments"],
              "table1_fieldNames": ["Employed","Unemployed","Not In the Labour Force","Color", "Comments"]
            },
            "desc": "Census 2011 and 2006 data were collected from population 15 years and over; Census 2001 data were collected from population 20-64 years and over (<i>sic<i>)"
          },
          {
            "id":"work_census_labour_2010",
            "text":"Census Labour Statistics in 2010",
            "type":"group",
            "children":[
              {
                "id":"work_census_labour_2010_full_time",
                "text":"Census Labour Statistics",
                "type":"item",
                "server":{
                  "table1": "north_work_full_part",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["full_time","part_time","not_worked","color","comments"],
                  "table1_fieldNames": ["Employed Full-Time","Employed Part-Time","Did Not Work","Color", "Comments"]
                },
                "desc": ""
              },
              {
                "id":"work_census_labour_2010_avg_weeks",
                "text":"Average Weeks Worked",
                "type":"item",
                "server":{
                  "table1": "north_work_full_part",
                  "table1_id": "uid_join",
                  "chart": "bar",
                  "table1_fields": ["ave_week","color","comments"],
                  "table1_fieldNames": ["Average Weeks Worked","Color", "Comments"]
                },
                "desc": "Average weeks worked (level of full work place participation)"
              }
            ]
          },
          {
            "id":"work_census_sector",
            "text":"Labour Force by 12 Occupation Sectors",
            "type":"item",
            "server":{
              "table1": "north_work_sector",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["a","b","c","d","e","f","g","h","i","j","na","color","comments"],
              "table1_fieldNames": ["A","B","C","D","E","F","G","H","I","J","N\/A","Color", "Comments"]
            },
            "desc": "<ul><li>A:Management</li><li>B:Business/Finance</li><li>C:Sciences</li><li>D:Health</li><li>E:Educ. Gov't</li><li>F:Arts Culture</li><li>G:Sales/Services</li><li>H:Trades, Transport</li><li>I:Primary</li><li>J:Manufacturing/Utilities</li><li>N\/A:Not Applicable</li></ul>"
          },
          {
            "id":"work_census_emp_industry",
            "text":"Census Employment by Industy",
            "type":"group",
            "children":[
              {
                "id":"work_census_emp_industry_01",
                "text":"2001",
                "type":"item",
                "server":{
                  "table1": "north_work_01",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["agri","mfg_constr","retail_whole","finance","social","business","other","color","comments"],
                  "table1_fieldNames": ["A","B","C","D","E","F","G","Color", "Comments"]
                },
                "desc": "<ul><li>A:Agriculture and Other resource-based Industries</li><li>B:Manufacturing & Construction</li><li>C:Retail & Wholesale Trade</li><li>D:Finance and Real Estate</li><li>E:Education & Health Care and Social Services</li><li>F:Business Services</li><li>G:Other Services</li></ul>"
              },
              {
                "id":"work_census_emp_industry_06_10",
                "text":"2006 & 2010",
                "type":"item",
                "server":{
                  "table1": "north_work_06_11",
                  "table1_id": "uid_join",
                  "chart": "pie",
                  "table1_fields": ["agri","mining","utilities","constr","mfg","wholesale","retail","trans_ware","cultural","finance","estate","science","mgmt","admin","education","health","recreation","accom","public","other","na","color","comments"],
                  "table1_fieldNames": ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","N\/A","Color", "Comments"]
                },
                "desc": "<ul><li>A:Agriculture and Other resource-based Industries</li><li>B:Mining Oil & Gas</li><li>C:utilities</li><li>D:Construction</li><li>E:Manufacturing</li><li>F:Wholesale trade</li><li>G:Retail trade</li><li>H:Transportation & Warehousing</li><li>I:Information and Cultural Industies</li><li>J:Finance and real estate</li><li>K:Real Estate, Rental and Leasing</li><li>L:Professional, Sceince & Technical services</li><li>M:Management of Companies</li><li>N:Admin Support, waste and Remedial Services</li><li>O:Educational Services</li><li>P:Health and Social Assistance</li><li>Q:Arts and Entertainment & Recreation</li><li>R:Accommodation and Food Services</li><li>S:Public Administration</li><li>T:Other Services</li><li>N\/A:Not Applicable</li></ul>"
              }
            ]
          }
        ]
      },
      {
        "id":"edu",
        "text":"Education",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"edu_census",
            "text":"Census Education",
            "type":"item",
            "server":{
              "table1": "north_edu",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["no_degree","high","trade","college","univ_below","univ_above","color","comments"],
              "table1_fieldNames": ["A","B","C","D","E","F","Color", "Comments"]
            },
            "desc": "<ul><li>A:No certificate, diploma or degree</li><li>B:High school certificate or equivalent</li><li>C:Apprenticeship or trades certificate or diploma</li><li>D:College, CEGEP or other non-university certificate or diploma</li><li>E:University certificate or diploma below bachelor level</li><li>F:University certificate or degree at bachelor's level or above</li></ul>Census 2011 and 2006 were collected from age group 25-64, and census 2001 from age group 34-64. Original values are all in percentages, from which this service calculated absolute values."
          }
        ]
      },
      {
        "id":"income",
        "text":"Income",
        "type":"cat",
        "state": { "opened":1 },
        "children":[
          {
            "id":"imcome_median",
            "text":"Census Median Income",
            "type":"item",
            "server":{
              "table1": "north_income",
              "table1_id": "uid_join",
              "chart": "bar",
              "table1_fields": ["all_median","color","comments"],
              "table1_fieldNames": ["Median Income","Color", "Comments"]
            },
            "desc": "Census Median Income All Private Households in Dollars. "
          },
          {
            "id":"income_compose",
            "text":"Income Composition",
            "type":"item",
            "server":{
              "table1": "north_income",
              "table1_id": "uid_join",
              "chart": "pie",
              "table1_fields": ["prc_market","prc_earned","prc_gov","prc_other","color","comments"],
              "table1_fieldNames": ["Market Income","Earned Income","Gov't Transfer","Other Money/ Investment","Color", "Comments"]
            },
            "desc": "Composition of Individual's Incomes as Percentages. "
          },
          {
            "id":"imcome_y15_",
            "text":" Persons with Incomes Aged 15+",
            "type":"group",
            "children":[
              {
                "id":"income_y15_person",
                "text":"Persons with Incomes",
                "type":"item",
                "server":{
                  "table1": "north_income",
                  "table1_id": "uid_join",
                  "chart": "bar",
                  "table1_fields": ["y15_income","color","comments"],
                  "table1_fieldNames": ["Persons with Incomes","Color", "Comments"]
                },
              "desc": ""
              },
              {
                "id":"income_y15_median",
                "text":"Median Income",
                "type":"item",
                "server":{
                  "table1": "north_income",
                  "table1_id": "uid_join",
                  "chart": "bar",
                  "table1_fields": ["y15_median","color","comments"],
                  "table1_fieldNames": ["Median Income","Color", "Comments"]
                },
              "desc": "Median Income Individual with Income."
              }
            ]
          }
        ]
      }
    ]
  }]
}
