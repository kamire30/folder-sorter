
class DashboardInput {

    static input_button = document.getElementById('select-folder-btn');

    static handle_input() {
        // On clicking the input button, the user can select a folder, and then the program get its information
        DashboardInput.input_button.addEventListener('click', async () => {
            console.log("TESTINPUTBUTTONS");
            GLOBALS.all_files = {
                "file": [],
                "directory": []
            };

            // The actual prompt to pick a folder
            GLOBALS.directory_handles = await window.showDirectoryPicker({mode:"readwrite"});

            // Updating the globals with the selected folder
            await DashboardInput.update_all_files();

            //Updating the view
            var new_folder_title = GLOBALS.directory_handles.name
            ViewUpdater.folder_title.innerHTML = ViewUpdater.too_long_handler(new_folder_title, 25)
            ViewUpdater.update_view();

            // Making a new structure, as we dont want to have connections with the previous one
            Struct_Manager.instantiate_structure()
            Structure_View_Manager.update_structure_view()
        });
    }
    

    static async update_all_files() {
        
        /* 
            Updating the current viewed subfolder
            as it makes no sense to keep on viewing a subfolder that the user hasnt even selected
            Also reseting the path to the subfolder
        */
        GLOBALS.current_viewed_folder = GLOBALS.directory_handles;
        GLOBALS.subfolder_view_path = [GLOBALS.current_viewed_folder]
        // Updating the subfolder view
        SubfolderViewManager.files_and_subfolders_list.innerHTML = `
        <div id="placeholder-subfolder" class="placeholder-obj">
            <img class="frontimg" src="/static/imgs/folder-icon.png">
            <h3>Subfolder Name</h3>
            <button class="delete-btn placeholder-obj"><img src="/static/imgs/trash-can.png"></button>
            <button class="info-btn placeholder-obj"><img src="/static/imgs/info.png"></button>
        </div>
        `
        await DashboardInput.just_update_all_files()
    }

    static async just_update_all_files() {
        GLOBALS.all_files = {
            "file": [],
            "directory": []
        };
        // Updating the list of all files and folders
        for await (var thing of GLOBALS.directory_handles.values()){
            if (thing.kind == "file") {
                GLOBALS.all_files[thing.kind].push(thing)
            } else if (thing.kind == "directory") {
                GLOBALS.all_files[thing.kind].push(thing)
            }
        }
    }
}
