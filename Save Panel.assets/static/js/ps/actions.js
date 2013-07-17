﻿g_class_action_set = charIDToTypeID('ASet');
g_class_action = charIDToTypeID('Actn');
g_key_name = charIDToTypeID('Nm  ');
g_key_number_of_children = charIDToTypeID('NmbC');

/**
 * Walks all the items in the action palette and record the action set names
 * and all the action children. Returns an array of all the ActionData.
 *
 * Note: This will throw an error during a normal execution. There is a bug
 * in Photoshop that makes it impossible to get an accurate count of the number
 * of action sets.
 *
 * Prettified version of function originally from Adobe's Image Processor
 * script.
 */
function get_action_set_info() {
	var action_set_info, set_counter, ref, desc, action_data, children;
	
	action_set_info = [];
	set_counter = 1;
	//timeout = 3000;
	//start = new Date().getTime();

  	while (true) {
		ref = new ActionReference();
		desc = undefined;
		children = 0;

		ref.putIndex(g_class_action_set, set_counter);

		try {
			desc = executeActionGet(ref);
		} catch (e) { break; }

		action_data = new ActionData();

		if (desc.hasKey(g_key_name))
			action_data.name = desc.getString(g_key_name);

		if (desc.hasKey(g_key_number_of_children))
			children = desc.getInteger(g_key_number_of_children);

		if (children) {
			action_data.children = get_action_info(set_counter, children);
			action_set_info.push(action_data);
		}
		set_counter++;

		//if (new Date().getTime() > (start + timeout))
			//break;
	}
	return action_set_info;
}


/**
 * Used when walking through all the actions in the specified action set.
 * Return true if file or folder is to be displayed, false otherwise.
 */
function get_action_info(set_index, num_children) {
	var action_info, action_data, ref, desc, children;
	
	action_info = [];
	children = 0;

	for (var i = 1; i <= num_children; i++) {

		ref = new ActionReference();
		ref.putIndex(g_class_action, i);
		ref.putIndex(g_class_action_set, set_index);

		desc = executeActionGet(ref);
		action_data = new ActionData();

		if (desc.hasKey(g_key_name))
			action_data.name = desc.getString(g_key_name);
		
		if (desc.hasKey(g_key_number_of_children))
			children = desc.getInteger(g_key_number_of_children);
		
		action_info.push(action_data);
	}

	return action_info;
}


/**
 * ActionData constructor. Holds info about an action set or an action.
 */
function ActionData() {
	this.name = '';
	this.children = undefined;

	this.toString = function ()
	{
		var str = this.name;
		if (undefined != this.children)
			for (var i = 0; i < this.children.length; i++)
				str += ' ' + this.children[i].toString();

		return str;
	}
}

