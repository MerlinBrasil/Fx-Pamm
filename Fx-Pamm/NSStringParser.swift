//
//  NSStringParser.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 17/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import Foundation

extension NSString {
    
    func searchWithRegex(#regex: NSString) -> NSString? {
        
        let regex = NSRegularExpression(pattern:regex, options:nil, error:nil)
        
        let firstMatchRange = regex.rangeOfFirstMatchInString(
            self,
            options: NSMatchingOptions.ReportProgress,
            range: NSMakeRange(0, self.length)
        )
        
        if firstMatchRange.location != NSNotFound {
            return self.substringWithRange(firstMatchRange)
        }
        
        return nil;
    }
    
    func parse(#open: NSString, close: NSString ) -> NSString? {
        var divRange:NSRange = self.rangeOfString(open, options:NSStringCompareOptions.CaseInsensitiveSearch);
        if (divRange.location != NSNotFound)
        {
            var endDivRange = NSMakeRange(divRange.length + divRange.location, self.length - ( divRange.length + divRange.location))
            endDivRange = self.rangeOfString(close, options:NSStringCompareOptions.CaseInsensitiveSearch, range:endDivRange);
            
            if (endDivRange.location != NSNotFound)
            {
                divRange.location += divRange.length;
                divRange.length  = endDivRange.location - divRange.location;
            }
        }
        
        if divRange.location != NSNotFound {
            return self.substringWithRange(divRange);
        }
        
        return nil
    }
    
    func parseAll(#between: NSString, and: NSString) -> Array<NSString> {
        
        var source: NSString = self
        var result: Array<NSString> = Array<NSString>()
        
        var divRange:NSRange!
        var endDivRange:NSRange!
        
        do {
            divRange = source.rangeOfString(between, options:NSStringCompareOptions.CaseInsensitiveSearch);
            
            
            if (divRange.location != NSNotFound)
            {
                endDivRange = NSMakeRange(divRange.length + divRange.location, source.length - ( divRange.length + divRange.location))
                endDivRange = source.rangeOfString(and, options:NSStringCompareOptions.CaseInsensitiveSearch, range:endDivRange);
                
                if (endDivRange.location != NSNotFound)
                {
                    divRange.location += divRange.length;
                    divRange.length  = endDivRange.location - divRange.location;
                }
                
                var index:NSString = source.substringWithRange(divRange)
                result.append(index)
                
                if endDivRange.location != NSNotFound {
                    source = source.substringFromIndex(endDivRange.location)
                }
            }
            
        } while divRange.location != NSNotFound
        
        return result
    }
}