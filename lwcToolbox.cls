public with sharing class lwcToolbox {
    @AuraEnabled(cacheable=true)
    public static LabelByCategory[] useLabelCategory(String categoryName){
        LabelByCategory[] ret = new List<LabelByCategory>();
        try {
            String baseURL = 'callout:lwcToolbox';
            String body = fetch( 
                baseURL +
                'SELECT+MasterLabel,Value+FROM+ExternalString+WHERE+Category=\''+categoryName+'\'+LIMIT+2',
            'GET', UserInfo.getSessionId());
            ret = LabelByCategory.parse(
                body.substringAfter('"records":').removeEnd('}')
            );
            system.debug('## lwcToolbox '+ ret);
        } catch (Exception e) {
            system.debug('## lwcToolbox '+ e);
            throw new AuraHandledException(e.getMessage());
        }
        return ret;
    }

    static String fetch(String endPoint, String method, String sid) {
        String ret = '';
        Http h = new Http();
        HttpRequest hr = new HttpRequest();
        hr.setHeader('Authorization', 'Bearer ' + sid);
        hr.setTimeout(3000);
        hr.setEndpoint(endpoint);
        hr.setMethod(method);
        HttpResponse r = h.send(hr);
        if(r.getStatusCode() == 200) {
            ret = r.getBody();
        }
        return ret;
    }
    
    
}

//system.debug(lwcToolbox.useLabelCategory('Copado'));