import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { CfnSubnet, Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SrcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

      // ---- VPC ----
        // ap-northeast-1
        const tkyVPC = new ec2.Vpc( this, "tkyVpc", {
          cidr: "10.1.0.0/16",
          defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
          enableDnsSupport: true,
          enableDnsHostnames: true,
          subnetConfiguration: []
      });

      const tkySubnet = new ec2.Subnet( this, "tkySubnet", {
          availabilityZone: "ap-northeast-1a",
          vpcId: tkyVPC.vpcId,
          cidrBlock: "10.1.1.0/24",
      });

      const tkyInternetGateway = new ec2.CfnInternetGateway( this, "tkyIGW", {})
      new ec2.CfnVPCGatewayAttachment(this, "tkyIGwAttach", {
          vpcId: tkyVPC.vpcId,
          internetGatewayId: tkyInternetGateway.ref
      });

      tkySubnet.addRoute("tkySubnetRoute", {
        routerType: ec2.RouterType.GATEWAY,
        routerId: tkyInternetGateway.ref
      });

      // ap-northeast-3
//     const oskVPC = new ec2.Vpc( this, "oskVpc", {
//         cidr: "10.3.0.0/16",
//         defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
//         enableDnsSupport: true,
//         enableDnsHostnames: true,
//         subnetConfiguration: []
//     });
//
//     const oskSubnet = new ec2.Subnet( this, "oskSubnet", {
//         availabilityZone: "ap-northeast-1c",
//         vpcId: oskVPC.vpcId,
//         cidrBlock: "10.3.3.0/24"
//     });
//
//     const oskInternetGateway = new ec2.CfnInternetGateway( this, "oskIGW", {})
//     new ec2.CfnVPCGatewayAttachment(this, "oskIGwAttach", {
//         vpcId: oskVPC.vpcId,
//         internetGatewayId: oskInternetGateway.ref
//     });
//
//      oskSubnet.addRoute("oskSubnetRoute", {
//        routerType: ec2.RouterType.GATEWAY,
//        routerId: oskInternetGateway.ref
//      });

      // ---- Security Group ----

      // ap-northeast-1
      const tkySecurityGroup = new SecurityGroup(this, "tkySecurityGroup",{
        vpc: tkyVPC
      });

      tkySecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allIcmp());
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3389));

      // ap-northeast-3
//      const oskSecurityGroup = new SecurityGroup(this, "oskSecurityGroup",{
//        vpc: oskVPC
//      });

//      oskSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
//      oskSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allUdp());

      // ---- EC2 ----

      const ec2Image = new ec2.AmazonLinuxImage({
                                              cpuType: ec2.AmazonLinuxCpuType.X86_64,
                                              edition: ec2.AmazonLinuxEdition.STANDARD,
                                              generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                                              storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE
                                });
      const ec2ImageWin = new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_JAPANESE_FULL_BASE);

      const tkyEc2a = new ec2.CfnInstance(this, "tkyEc2a", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2Image.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

      const tkyEc2b = new ec2.CfnInstance(this, "tkyEc2b", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2Image.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

      const tkyEc2c = new ec2.CfnInstance(this, "tkyEc2c", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2Image.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

      const tkyEc2d = new ec2.CfnInstance(this, "tkyEc2d", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2Image.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

      const tkyEc2e = new ec2.CfnInstance(this, "tkyEc2e", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2ImageWin.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

      const tkyEc2f = new ec2.CfnInstance(this, "tkyEc2f", {
        instanceType: new ec2.InstanceType("t3.micro").toString(),
        imageId: ec2ImageWin.getImage(this).imageId,
        networkInterfaces: [{
          associatePublicIpAddress: true,
          deviceIndex: "0",
          groupSet: [tkySecurityGroup.securityGroupId],
          subnetId: tkySubnet.subnetId
        }],
        keyName: this.node.tryGetContext('key_pair')
      });

//     const oskEc2 = new ec2.CfnInstance(this, "oskEc2", {
//       instanceType: new ec2.InstanceType("t3.micro").toString(),
//       imageId: ec2Image.getImage(this).imageId,
//       networkInterfaces: [{
//         associatePublicIpAddress: true,
//         deviceIndex: "0",
//         groupSet: [oskSecurityGroup.securityGroupId],
//         subnetId: oskSubnet.subnetId
//       }],
//       keyName: this.node.tryGetContext('key_pair')
//     });

      new CfnOutput(this, "Ida", { value: tkyEc2a.ref});
      new CfnOutput(this, "PublicIpa", { value: tkyEc2a.attrPublicIp });
  
      new CfnOutput(this, "Idb", { value: tkyEc2b.ref});
      new CfnOutput(this, "PublicIpb", { value: tkyEc2b.attrPublicIp });
    
      new CfnOutput(this, "Idc", { value: tkyEc2c.ref});
      new CfnOutput(this, "PublicIpc", { value: tkyEc2c.attrPublicIp });

      new CfnOutput(this, "Idd", { value: tkyEc2d.ref});
      new CfnOutput(this, "PublicIpd", { value: tkyEc2d.attrPublicIp });

      new CfnOutput(this, "Ide", { value: tkyEc2e.ref});
      new CfnOutput(this, "PublicIpe", { value: tkyEc2e.attrPublicIp });

      new CfnOutput(this, "Idf", { value: tkyEc2f.ref});
      new CfnOutput(this, "PublicIpf", { value: tkyEc2f.attrPublicIp });

//      new cdk.CfnOutput(this, "Id", { value: oskEc2.ref});
//      new cdk.CfnOutput(this, "PublicIp", { value: oskEc2.attrPublicIp });

  }
}
