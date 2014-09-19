//
//  IndexesViewController.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 16/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import UIKit

class IndexesViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    var model: FxIndexModel!
    var indexes: Array<FxIndex>!
    
    let identifier = "Indentifier"
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.tableView.dataSource = self
        self.tableView.delegate = self
        
        self.model = FxIndexModel()
        self.model.completionHandler = { (items : Array<FxIndex>) -> Void in
            self.indexes = items
            self.tableView.reloadData()
        }
        
        self.model.load()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        var cell: FxIndexTableViewCell? = tableView.dequeueReusableCellWithIdentifier(identifier) as FxIndexTableViewCell?
    
        var index: FxIndex = self.indexes[indexPath.row]
    
        cell?.name?.text = index.name
        cell?.profit?.text = NSString(format: "%.2f%%", index.profit!)
        cell?.startDate?.text = index.startDate
        
        return cell!
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if self.indexes != nil {
            return self.indexes.count
        }
        return 0
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }

}
