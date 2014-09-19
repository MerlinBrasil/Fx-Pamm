//
//  FxIndex.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 17/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import UIKit

class FxIndex: NSObject {
    
    let name: NSString?
    let profit: Double?
    let startDate: NSString?
    let detailsURL: NSURL?
    
    let profitRegExPattern = "([0-9]+\\.[0-9]+\\%)"
    let dateRegExpattern   = "(([0-9]){4}\\.([0-9]){2}\\.([0-9]){1,2} ([0-9]){1,2}:([0-9]){1,2})"
    
    init(html: NSString) {
        self.name = html.parse(open: "\">", close: "</a></td>")
        self.profit = html.searchWithRegex(regex: profitRegExPattern)?.doubleValue
        self.startDate = html.searchWithRegex(regex: dateRegExpattern)
        if let urlString = html.parse(open: "<a href=\"", close: "\">") {
            self.detailsURL = NSURL(string: urlString)
        }
    }
}
