//
//  FxIndexTableViewCell.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 17/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import UIKit

class FxIndexTableViewCell: UITableViewCell {
    
    @IBOutlet weak var name: UILabel!
    @IBOutlet weak var profit: UILabel!
    @IBOutlet weak var startDate: UILabel!
    
    
    override init(style: UITableViewCellStyle, reuseIdentifier: String!) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
    }
    
    required init(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
}