  import com.google.ortools.constraintsolver.Assignment;
	import com.google.ortools.constraintsolver.FirstSolutionStrategy;
	import com.google.ortools.constraintsolver.RoutingIndexManager;
	import com.google.ortools.constraintsolver.RoutingModel;
	import com.google.ortools.constraintsolver.RoutingSearchParameters;
	import com.google.ortools.constraintsolver.main;
	import java.util.logging.Logger;

public static Credential authorize() throws IOException {
    // Load client secrets.
    File cfile = new File("certs/cert.json");
    cfile.createNewFile();
    GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(jsonFactory, new InputStreamReader(new FileInputStream(cfile)));
    }
    public static Sheets getSheetsService() throws IOException {
    Credential credential = authorize();
    return new Sheets.Builder(transport, jsonFactory, credential)
            .setApplicationName("INSERT_YOUR_APPLICATION_NAME")
            .build();
}

public class TravelingSalesman {
	/** Minimal TSP using distance matrix. */
	  static {
	    System.loadLibrary("jniortools");
	  }

	  private static final Logger logger = Logger.getLogger(TspCities.class.getName());

	  static class DataModel {
	    public final long[][] distanceMatrix = {
	        {List<String> ranges = Arrays.asList("E1","E4");
 try {
        String id = "INSERT_SHEET_ID";
        String writeRange = "INSERT_SHEET_NAME!A3:E";

        List<List<Object>> writeData = new ArrayList<>();
        for (Data someData: myData) {
            List<Object> dataRow = new ArrayList<>();
            dataRow.add(someData.data1);
            dataRow.add(someData.data2);
            dataRow.add(someData.data3);
            dataRow.add(someData.data4);
            dataRow.add(someData.data5);
            writeData.add(dataRow);
        }

        ValueRange vr = new ValueRange().setValues(writeData).setMajorDimension("ROWS");
        service.spreadsheets().values()
                .update(id, writeRange, vr)
                .setValueInputOption("RAW")
                .execute();
    } catch (Exception e) {
        // handle exception

	  /// @brief Print the solution.
	  static void printSolution(
	      RoutingModel routing, RoutingIndexManager manager, Assignment solution) {
	    // Solution cost.
	    logger.info("Objective: " + solution.objectiveValue() + "miles");
	    // Inspect solution.
	    logger.info("Route:");
	    long routeDistance = 0;
	    String route = "";
	    long index = routing.start(0);
	    while (!routing.isEnd(index)) {
	      route += manager.indexToNode(index) + " -> ";
	      long previousIndex = index;
	      index = solution.value(routing.nextVar(index));
	      routeDistance += routing.getArcCostForVehicle(previousIndex, index, 0);
	    }
	    route += manager.indexToNode(routing.end(0));
	    logger.info(route);
	    logger.info("Route distance: " + routeDistance + "miles");
	  }

	  public static void main(String[] args) throws Exception {
	    // Instantiate the data problem.
	    final DataModel data = new DataModel();

	    // Create Routing Index Manager
	    RoutingIndexManager manager =
	        new RoutingIndexManager(data.distanceMatrix.length, data.vehicleNumber, data.depot);

	    // Create Routing Model.
	    RoutingModel routing = new RoutingModel(manager);

	    // Create and register a transit callback.
	    final int transitCallbackIndex =
	        routing.registerTransitCallback((long fromIndex, long toIndex) -> {
	          // Convert from routing variable Index to user NodeIndex.
	          int fromNode = manager.indexToNode(fromIndex);
	          int toNode = manager.indexToNode(toIndex);
	          return data.distanceMatrix[fromNode][toNode];
	        });

	    // Define cost of each arc.
	    routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

	    // Setting first solution heuristic.
	    RoutingSearchParameters searchParameters =
	        main.defaultRoutingSearchParameters()
	            .toBuilder()
	            .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
	            .build();

	    // Solve the problem.
	    Assignment solution = routing.solveWithParameters(searchParameters);

	    // Print solution on console.
	    printSolution(routing, manager, solution);
	  }
	}
}

