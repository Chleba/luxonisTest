export const SrealityFlatsModel = {
  rows: [
    // 'body > .ng-isolate-scope:nth-child(2) > #page-layout > .content-cover > .content-inner > .transcluded-content > div > div > .content > .ng-scope > .ng-isolate-scope > .dir-property-list > div', {
    // 'body > div.ng-isolate-scope:nth-child(2) > #page-layout > .content-cover > .content-inner > .transcluded-content.ng-scope > .ng-scope > .property-list > .content > .ng-scope > .ng-isolate-scope > .dir-property-list > .property', {
    // 'body .ng-isolate-scope:nth-child(2) > #page-layout > .content-cover > .content-inner > .transcluded-content', {
      // 'div:last-child > div#page-layout > div.content-cover', {
    // 'div.ng-isolate-scope:nth-child(2) > div#page-layout > div.content-cover > div.content-inner > div.transcluded-content > div.ng-scope > div.property-list > div.content > div.ng-scope > div[type="property"] > div.dir-property-list > div.property.ng-scope', {
      'div[page-layout] > div#page-layout > div.content-cover > div.content-inner > div.transcluded-content.ng-scope > div.ng-scope > div > .content > div > div[type="property"] > div > div.property.ng-scope', {
      flat: {
        href: '.info > .text-wrap > .basic > h2 > a (href)',
        name: '.info > .text-wrap > .basic > h2',
        location: '.info > .text-wrap > .basic > .locality.ng-binding',
        price: '.info > .text-wrap > .basic > .price.ng-scope',
      },
    },
  ]
};