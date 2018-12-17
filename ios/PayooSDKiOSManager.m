#import "PayooSDKiOSManager.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>


@implementation PayooSDKiOSManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(pay:(NSDictionary *)input
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  
//  NSString* merchantId = @"";
//  if ([input objectForKey:@"MerchantID"] != [NSNull null]) {
//    merchantId = "813";
//
//  }
//  NSString *merchantShareKey = @"";
//  if ([input objectForKey:@"MerchantShareKey"] != [NSNull null]) {
//    merchantShareKey = "5754f8a5f373aa955ccf3a8f69f75b25";
//  }
  
  NSString *checksum = @"";
  if ([input objectForKey:@"PayooOrderChecksum"] != [NSNull null]){
    checksum = [input objectForKey:@"PayooOrderChecksum"];
  }
  
  NSString *orderXML = @"";
  if ([input objectForKey:@"PayooOrderXML"] != [NSNull null]) {
    orderXML = [input objectForKey:@"PayooOrderXML"];
  }
  
  NSString *email = @"";
  if ([input objectForKey:@"Email"] != [NSNull null]) {
    email = [input objectForKey:@"Email"];
  }
  
  NSString *phone = @"";
  if ([input objectForKey:@"Phone"] != [NSNull null]) {
    phone = [input objectForKey:@"Phone"];
  }
  
  enum Language language = [[input objectForKey:@"1"] integerValue];
  [PayooSDKAppearance setNavigationBarBackgroundColor:[UIColor colorWithRed:157.0/255.0 green:47.0/255.0 blue:110.0/255.0 alpha:1.0]];
  self.order = [[OrderRequest alloc] initWithOrderInfo:orderXML checksum:checksum];
  dispatch_async(dispatch_get_main_queue(), ^{
    @try {
      [PayooSDKConfiguration setWithMerchantId:@"799"
                                     secretKey:@"3b15455cf91c99a224ff32b43f0b5dc0"];
      [PayooSDKConfiguration setEnvironment:EnvironmentDevelopment];
      [PayooSDKConfiguration setLanguage:language];
      
      
      PayooSDKPaymentConfig *paymentConfig = [PayooSDKPaymentConfig makeWithBuilder:^(PayooSDKPaymentConfigBuilder *builder) {
        builder.authToken = @"";
        builder.userId = @"";
        builder.defaultCustomerEmail = email;
        builder.defaultCustomerPhone = phone;
      }];
      [Payoo payWithOrderRequest:self.order paymentConfig:paymentConfig completionHandler:^(enum GroupType status, ResponseObject * _Nullable data) {
        NSLog(@"data : %@",data);
        NSMutableDictionary *result = [[NSMutableDictionary alloc] init];
        result[@"status"] = @(status);
        result[@"data"] = @(data.code);

        RCTLogInfo(@"success : %@",result);
        resolve(result);
      }];
    } @catch (NSException *exception) {
      RCTLogInfo(@"Failed %@", exception.reason);

      reject(@"no_events", @"There were no events", exception);
    }
  });
  

}

@end
