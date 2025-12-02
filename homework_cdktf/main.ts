import { App, TerraformStack } from "cdktf";
import { provider, container, image, network } from "@cdktf/provider-docker";
import { Construct } from "constructs";

class WordPressStack extends TerraformStack {
  constructor(scope: Construct, id: string, port: number) {
    super(scope, id);

    new provider.DockerProvider(this, "docker", {});

    const networkResource = new network.Network(this, "network", {
      name: `wordpress-network-${id}`,
    });

    const mysqlImage = new image.Image(this, "mysql-image", {
      name: "mysql:5.7",
      keepLocally: true,
    });

    const wordpressImage = new image.Image(this, "wordpress-image", {
      name: "wordpress:latest",
      keepLocally: true,
    });

    const mysqlContainerName = `mysql-${id}`;
    const mysqlContainer = new container.Container(this, "mysql-container", {
      name: mysqlContainerName,
      image: mysqlImage.imageId,
      networksAdvanced: [{ name: networkResource.name }],
      env: [
        "MYSQL_ROOT_PASSWORD=rootpass",
        "MYSQL_DATABASE=wordpress",
        "MYSQL_USER=wpuser",
        "MYSQL_PASSWORD=wppass",
      ],
      ports: [{ internal: 3306, external: port + 1000 }],
      restart: "unless-stopped",
    });

    new container.Container(this, "wordpress-container", {
      name: `wordpress-${id}`,
      image: wordpressImage.imageId,
      networksAdvanced: [{ name: networkResource.name }],
      env: [
        `WORDPRESS_DB_HOST=${mysqlContainerName}`,
        "WORDPRESS_DB_USER=wpuser",
        "WORDPRESS_DB_PASSWORD=wppass",
        "WORDPRESS_DB_NAME=wordpress",
      ],
      ports: [{ internal: 80, external: port }],
      dependsOn: [mysqlContainer],
      restart: "unless-stopped",
    });
  }
}

const app = new App();
new WordPressStack(app, "StackOne", 8081);
new WordPressStack(app, "StackTwo", 8082);
app.synth();
