//
//  FxIndexesModel.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 16/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import UIKit

class FxIndexModel: NSObject, NSXMLParserDelegate {
    
    private let IndexesURL:NSURL = NSURL.URLWithString("http://fx-trend.com/pamm/rating/")
    var indexies: Array<FxIndex> = Array<FxIndex>()
    var completionHandler: ((Array<FxIndex>) -> Void)!
    
    override init() {
        super.init()
    }
    
    func load() {
        let task: Void = NSURLSession.sharedSession().dataTaskWithURL(IndexesURL,
            completionHandler: { (data, response, error) -> Void in
                
                let strData:NSString = NSString(data: data, encoding: NSUTF8StringEncoding)
                
                var form:NSString? = strData.parse(
                    open: "<form action=\"/pamm/rating/\" method=\"post\" name=\"rep_index\">",
                    close: "</form>"
                )
                
                var trs: Array<NSString> = form!.parseAll(between: "<td><a", and: "</tr>")
                
                for indexString in trs {
                    self.indexies.append(FxIndex(html: indexString))
                }
                
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    self.completionHandler(self.indexies)
                })
    
        }).resume()
    }
    
    func loadDetails(withUrl: NSURL?, handler: ((AnyObject)->()) ) {
        handler("")
    }
}
