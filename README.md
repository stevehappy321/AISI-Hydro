Area2v2
-section modules declared in MAIN
-hardware modules moved out of GVLs into Subarea PROGRAM modules
-section modules are passed to subarea modules to be assigned hardware and called cyclically
-each subarea module is responsible for cyclically calling its own hardware and section modules
-master logic is retained in MAIN
