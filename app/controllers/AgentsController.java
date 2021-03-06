package controllers;

import lib.BreadcrumbList;
import org.graylog2.restclient.lib.APIException;
import play.mvc.Result;

import java.io.IOException;

public class AgentsController extends AuthenticatedController {
    public Result index() throws APIException, IOException {
        BreadcrumbList bc = new BreadcrumbList();
        bc.addCrumb("System", routes.SystemController.index(0));
        bc.addCrumb("Agents", routes.AgentsController.index());

        return ok(views.html.system.agents.index.render(currentUser(), bc));
    }
}
