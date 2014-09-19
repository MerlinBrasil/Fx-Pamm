//
//  IndexDetailsViewController.swift
//  Fx-Pamm
//
//  Created by Dmytro Andreikiv on 18/09/14.
//  Copyright (c) 2014 MobiHQ. All rights reserved.
//

import UIKit

class IndexDetailsViewController: UIViewController {

    let model = FxIndexModel()
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.model.loadDetails(withUrl: nil) { (<#AnyObject#>) -> () in
            
        }
        
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue!, sender: AnyObject!) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
